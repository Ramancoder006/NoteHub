import uuid

from fastapi import (
    FastAPI,
    HTTPException,
    UploadFile,
    File,
    Form,
    Header,
)

from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

from database import supabase


# =========================================================
# FASTAPI APPLICATION
# =========================================================

app = FastAPI(
    title="NoteHub API",
    description="Backend API for NoteHub",
    version="6.0.0",
)


# =========================================================
# CORS CONFIGURATION
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# AUTHENTICATION HELPER
# =========================================================

def get_authenticated_user(authorization: str):

    if not authorization:
        raise HTTPException(
            status_code=401,
            detail="Authorization token missing",
        )

    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Invalid authorization header",
        )

    token = authorization.replace(
        "Bearer ",
        "",
        1,
    ).strip()

    if not token:
        raise HTTPException(
            status_code=401,
            detail="Authorization token missing",
        )

    try:

        response = supabase.auth.get_user(token)

        user = response.user

        if not user:
            raise HTTPException(
                status_code=401,
                detail="Invalid or expired login",
            )

        return user

    except HTTPException:
        raise

    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired login",
        )


# =========================================================
# PYDANTIC MODELS
# =========================================================

class Note(BaseModel):
    title: str
    subject: str
    semester: int
    description: str
    uploader: str


class NoteUpdate(BaseModel):
    title: Optional[str] = None
    subject: Optional[str] = None
    semester: Optional[int] = None
    description: Optional[str] = None
    uploader: Optional[str] = None


# =========================================================
# HOME
# =========================================================

@app.get("/")
def home():

    return {
        "message": "Welcome to NoteHub API",
        "database": "Supabase",
        "storage": "Supabase Storage",
        "authentication": "Supabase Auth",
        "status": "Backend running successfully",
        "version": "6.0.0",
    }


# =========================================================
# HEALTH CHECK
# =========================================================

@app.get("/health")
def health():

    return {
        "status": "healthy",
        "database": "Supabase",
    }


# =========================================================
# GET ALL NOTES
# =========================================================

@app.get("/notes")
def get_notes():

    try:

        response = (
            supabase
            .table("notes")
            .select("*")
            .order(
                "created_at",
                desc=True,
            )
            .execute()
        )

        return response.data

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error),
        )


# =========================================================
# GET ONE NOTE
# =========================================================

@app.get("/notes/{note_id}")
def get_note(note_id: int):

    try:

        response = (
            supabase
            .table("notes")
            .select("*")
            .eq(
                "id",
                note_id,
            )
            .execute()
        )

        if not response.data:

            raise HTTPException(
                status_code=404,
                detail="Note not found",
            )

        return response.data[0]

    except HTTPException:
        raise

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error),
        )


# =========================================================
# CREATE NOTE WITHOUT PDF
# =========================================================

@app.post(
    "/notes",
    status_code=201,
)
def create_note(note: Note):

    try:

        note_data = {
            "title": note.title,
            "subject": note.subject,
            "semester": note.semester,
            "description": note.description,
            "uploader": note.uploader,
            "downloads": 0,
        }

        response = (
            supabase
            .table("notes")
            .insert(note_data)
            .execute()
        )

        return {
            "message": "Note created successfully",
            "note": response.data[0],
        }

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error),
        )


# =========================================================
# UPDATE NOTE
# =========================================================

@app.put("/notes/{note_id}")
def update_note(
    note_id: int,
    updated_note: NoteUpdate,
):

    update_data = (
        updated_note
        .model_dump(
            exclude_unset=True
        )
    )

    if not update_data:

        raise HTTPException(
            status_code=400,
            detail="No fields provided",
        )

    try:

        response = (
            supabase
            .table("notes")
            .update(update_data)
            .eq(
                "id",
                note_id,
            )
            .execute()
        )

        if not response.data:

            raise HTTPException(
                status_code=404,
                detail="Note not found",
            )

        return {
            "message": "Note updated successfully",
            "note": response.data[0],
        }

    except HTTPException:
        raise

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error),
        )


# =========================================================
# UPLOAD NOTE WITH PDF
# AUTHENTICATION REQUIRED
# =========================================================

@app.post(
    "/upload-note",
    status_code=201,
)
async def upload_note(
    title: str = Form(...),
    subject: str = Form(...),
    semester: int = Form(...),
    description: str = Form(...),
    file: UploadFile = File(...),
    authorization: str = Header(None),
):

    uploaded_file_path = None

    try:

        # -------------------------------------------------
        # VERIFY LOGGED-IN USER
        # -------------------------------------------------

        user = get_authenticated_user(
            authorization
        )

        user_id = str(user.id)

        user_email = user.email or ""

        metadata = user.user_metadata or {}

        uploader = (
            metadata.get("full_name")
            or metadata.get("name")
            or user_email.split("@")[0]
            or "Student"
        )


        # -------------------------------------------------
        # VALIDATE PDF
        # -------------------------------------------------

        if file.content_type != "application/pdf":

            raise HTTPException(
                status_code=400,
                detail="Only PDF files are allowed",
            )


        file_content = await file.read()


        if len(file_content) == 0:

            raise HTTPException(
                status_code=400,
                detail="Uploaded PDF is empty",
            )


        max_size = 10 * 1024 * 1024


        if len(file_content) > max_size:

            raise HTTPException(
                status_code=400,
                detail="PDF must be smaller than 10 MB",
            )


        # -------------------------------------------------
        # CREATE SAFE UNIQUE FILE NAME
        # -------------------------------------------------

        original_filename = (
            file.filename
            if file.filename
            else "note.pdf"
        )

        safe_filename = (
            original_filename
            .replace("/", "_")
            .replace("\\", "_")
        )

        unique_filename = (
            f"{uuid.uuid4()}_{safe_filename}"
        )

        uploaded_file_path = unique_filename


        # -------------------------------------------------
        # UPLOAD PDF TO SUPABASE STORAGE
        # -------------------------------------------------

        supabase.storage.from_(
            "notes-files"
        ).upload(
            path=unique_filename,
            file=file_content,
            file_options={
                "content-type": "application/pdf"
            },
        )


        # -------------------------------------------------
        # GET PUBLIC PDF URL
        # -------------------------------------------------

        file_url = (
            supabase
            .storage
            .from_("notes-files")
            .get_public_url(
                unique_filename
            )
        )


        # -------------------------------------------------
        # SAVE NOTE IN DATABASE
        # IMPORTANT: file_path IS NOW SAVED
        # -------------------------------------------------

        note_data = {
            "title": title,
            "subject": subject,
            "semester": semester,
            "description": description,
            "uploader": uploader,
            "user_id": user_id,
            "downloads": 0,
            "file_url": file_url,
            "file_path": unique_filename,
        }


        response = (
            supabase
            .table("notes")
            .insert(note_data)
            .execute()
        )


        return {
            "message":
                "Note and PDF uploaded successfully",
            "note":
                response.data[0],
        }


    except HTTPException:
        raise


    except Exception as error:

        # If the PDF was uploaded but database insertion
        # failed, try to remove the orphaned PDF.

        if uploaded_file_path:

            try:

                supabase.storage.from_(
                    "notes-files"
                ).remove([
                    uploaded_file_path
                ])

            except Exception:
                pass


        raise HTTPException(
            status_code=500,
            detail=str(error),
        )


# =========================================================
# GET LOGGED-IN USER'S NOTES
# =========================================================

@app.get("/my-notes")
def get_my_notes(
    authorization: str = Header(None),
):

    try:

        user = get_authenticated_user(
            authorization
        )

        user_id = str(user.id)


        response = (
            supabase
            .table("notes")
            .select("*")
            .eq(
                "user_id",
                user_id,
            )
            .order(
                "created_at",
                desc=True,
            )
            .execute()
        )


        return response.data


    except HTTPException:
        raise


    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error),
        )


# =========================================================
# DELETE LOGGED-IN USER'S NOTE
# AUTHENTICATION + OWNERSHIP REQUIRED
# =========================================================

@app.delete("/my-notes/{note_id}")
def delete_my_note(
    note_id: int,
    authorization: str = Header(None),
):

    try:

        # -------------------------------------------------
        # VERIFY LOGGED-IN USER
        # -------------------------------------------------

        user = get_authenticated_user(
            authorization
        )

        user_id = str(user.id)


        # -------------------------------------------------
        # FIND NOTE
        # -------------------------------------------------

        response = (
            supabase
            .table("notes")
            .select("*")
            .eq(
                "id",
                note_id,
            )
            .execute()
        )


        if not response.data:

            raise HTTPException(
                status_code=404,
                detail="Note not found",
            )


        note = response.data[0]


        # -------------------------------------------------
        # VERIFY OWNERSHIP
        # -------------------------------------------------

        note_user_id = note.get(
            "user_id"
        )


        if not note_user_id:

            raise HTTPException(
                status_code=403,
                detail=(
                    "This note has no owner information "
                    "and cannot be deleted from the dashboard."
                ),
            )


        if str(note_user_id) != user_id:

            raise HTTPException(
                status_code=403,
                detail=(
                    "You can only delete your own notes."
                ),
            )


        # -------------------------------------------------
        # GET STORAGE FILE PATH
        # -------------------------------------------------

        file_path = note.get(
            "file_path"
        )


        # -------------------------------------------------
        # DELETE PDF FROM STORAGE
        # -------------------------------------------------

        if file_path:

            try:

                supabase.storage.from_(
                    "notes-files"
                ).remove([
                    file_path
                ])

            except Exception as storage_error:

                print(
                    "Storage deletion warning:",
                    storage_error,
                )


        # -------------------------------------------------
        # DELETE DATABASE ROW
        # -------------------------------------------------

        delete_response = (
            supabase
            .table("notes")
            .delete()
            .eq(
                "id",
                note_id,
            )
            .eq(
                "user_id",
                user_id,
            )
            .execute()
        )


        return {
            "message":
                "Note deleted successfully",

            "deleted_note_id":
                note_id,

            "file_deleted":
                bool(file_path),

            "database_result":
                delete_response.data,
        }


    except HTTPException:
        raise


    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error),
        )


# =========================================================
# INCREASE DOWNLOAD COUNT
# =========================================================

@app.post(
    "/notes/{note_id}/download"
)
def increase_download_count(
    note_id: int
):

    try:

        # -------------------------------------------------
        # FIND NOTE
        # -------------------------------------------------

        response = (
            supabase
            .table("notes")
            .select("*")
            .eq(
                "id",
                note_id,
            )
            .execute()
        )


        if not response.data:

            raise HTTPException(
                status_code=404,
                detail="Note not found",
            )


        note = response.data[0]


        # -------------------------------------------------
        # GET CURRENT DOWNLOAD COUNT
        # -------------------------------------------------

        current_downloads = (
            note.get("downloads")
            or 0
        )


        new_downloads = (
            current_downloads + 1
        )


        # -------------------------------------------------
        # UPDATE DOWNLOAD COUNT
        # -------------------------------------------------

        update_response = (
            supabase
            .table("notes")
            .update({
                "downloads":
                    new_downloads
            })
            .eq(
                "id",
                note_id,
            )
            .execute()
        )


        return {
            "message":
                "Download count updated successfully",

            "downloads":
                new_downloads,

            "note":
                update_response.data[0],
        }


    except HTTPException:
        raise


    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error),
        )