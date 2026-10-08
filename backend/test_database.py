from database import supabase


try:

    response = (
        supabase
        .table("notes")
        .select("*")
        .execute()
    )

    print("=================================")
    print("SUPABASE CONNECTED SUCCESSFULLY!")
    print("=================================")

    print()

    for note in response.data:

        print("ID:", note["id"])
        print("Title:", note["title"])
        print("Subject:", note["subject"])
        print("Semester:", note["semester"])
        print("-------------------------")

except Exception as error:

    print("SUPABASE CONNECTION FAILED!")

    print(error)