'use client'
import { useParams } from "next/navigation";
const Page = () => {
    const params = useParams<{ username: string }>();
    return (
        <div>
            <h1>Page</h1>
            <p>Username: {params.username}</p>
        </div>
    )

}
export default Page;