import Link from "next/link";

const AccessDenied = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Access Denied
        </h2>
        <p className="text-center text-gray-600 mb-4">
          You do not have permission to access this page.
        </p>
        <div className="flex justify-center">
          <Link href="/api/auth/logout" prefetch={false}>
            <button className="text-blue-500 hover:text-blue-600">Logout</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
