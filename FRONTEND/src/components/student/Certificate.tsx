export default function Certificate() {
    // const { studentId } = useParams();
    // const [certificate, setCertificate] = useState<any>(null);

    // useEffect(() => {
    //     fetch(`https://your-backend.com/student/certificate/${studentId}`)
    //         .then((res) => res.json())
    //         .then((data) => setCertificate(data))
    //         .catch((err) => console.error(err));
    // }, [studentId]);

    // if (!certificate) return <div className="text-center mt-20">Loading...</div>;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <h1 className="text-3xl font-bold mb-6">Certificate</h1>
            <div className="bg-white p-6 shadow-md rounded w-full max-w-lg text-center">
                <p className="mb-4">Congratulations, !</p>
                <p className="mb-4">You have completed the course: </p>
                <p className="text-gray-500">Date of Completion:</p>
            </div>
        </div>
    );
}
