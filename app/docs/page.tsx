export default function DocsPage() {
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">BoxRec API Documentation</h1>

      <div className="space-y-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Introduction</h2>
          <p>
            This API provides a proxy to access BoxRec.com data programmatically. It handles authentication and parsing
            of BoxRec data, making it easier to integrate boxing data into your applications.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Authentication</h2>
          <p>Before using any API endpoints, you must authenticate with BoxRec credentials.</p>

          <div className="bg-slate-100 p-4 rounded-md">
            <h3 className="font-mono text-lg mb-2">POST /api/auth</h3>
            <p className="mb-2">Request Body:</p>
            <pre className="bg-slate-200 p-3 rounded-md overflow-x-auto">
              {`{
  "username": "your_boxrec_username",
  "password": "your_boxrec_password"
}`}
            </pre>
            <p className="mt-2">Response (Success):</p>
            <pre className="bg-slate-200 p-3 rounded-md overflow-x-auto">
              {`{
  "success": true,
  "message": "Successfully authenticated with BoxRec"
}`}
            </pre>
          </div>

          <p className="text-sm text-muted-foreground">
            Note: Authentication creates a session that is stored in cookies. You must authenticate before using any
            other endpoints.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">API Endpoints</h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-mono text-lg mb-2">GET /api/boxer/:id</h3>
              <p className="mb-2">Get detailed information about a boxer by their BoxRec ID.</p>
              <p className="mb-2">
                Example: <code>/api/boxer/348759</code>
              </p>
              <p className="mb-2">Response:</p>
              <pre className="bg-slate-200 p-3 rounded-md overflow-x-auto">
                {`{
  "id": "348759",
  "name": "Tyson Fury",
  "nickname": "Gypsy King",
  "record": {
    "wins": 34,
    "losses": 0,
    "draws": 1
  },
  "kos": 24,
  "personal_info": {
    "nationality": "United Kingdom",
    "division": "heavyweight",
    "stance": "orthodox",
    "height": "6′ 9″",
    "reach": "85″",
    "residence": "Morecambe, Lancashire, United Kingdom",
    "birth_place": "Manchester, Lancashire, United Kingdom",
    "birth_date": "1988-08-12"
  },
  "bouts": [
    // Array of bout objects
  ]
}`}
              </pre>
            </div>

            <div>
              <h3 className="font-mono text-lg mb-2">GET /api/search?query=:name</h3>
              <p className="mb-2">Search for boxers by name.</p>
              <p className="mb-2">
                Example: <code>/api/search?query=Canelo</code>
              </p>
              <p className="mb-2">Response:</p>
              <pre className="bg-slate-200 p-3 rounded-md overflow-x-auto">
                {`[
  {
    "id": "348759",
    "name": "Saul Alvarez",
    "record": "60-2-2",
    "last_fight": "2023-09-30"
  },
  // More results
]`}
              </pre>
            </div>

            <div>
              <h3 className="font-mono text-lg mb-2">GET /api/ratings/:division</h3>
              <p className="mb-2">Get ratings for a specific weight division.</p>
              <p className="mb-2">
                Example: <code>/api/ratings/heavyweight</code>
              </p>
              <p className="mb-2">Response:</p>
              <pre className="bg-slate-200 p-3 rounded-md overflow-x-auto">
                {`{
  "division": "heavyweight",
  "ratings": [
    {
      "rank": 1,
      "id": "348759",
      "name": "Tyson Fury",
      "points": 1352.65,
      "record": "34-0-1"
    },
    // More boxers
  ]
}`}
              </pre>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Error Handling</h2>
          <p>All API endpoints return appropriate HTTP status codes and error messages in case of failure.</p>
          <pre className="bg-slate-200 p-3 rounded-md overflow-x-auto">
            {`{
  "error": "Error message description"
}`}
          </pre>

          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-slate-200">
                <th className="border border-slate-300 px-4 py-2 text-left">Status Code</th>
                <th className="border border-slate-300 px-4 py-2 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-300 px-4 py-2">400</td>
                <td className="border border-slate-300 px-4 py-2">Bad Request - Missing required parameters</td>
              </tr>
              <tr>
                <td className="border border-slate-300 px-4 py-2">401</td>
                <td className="border border-slate-300 px-4 py-2">Unauthorized - Authentication required</td>
              </tr>
              <tr>
                <td className="border border-slate-300 px-4 py-2">404</td>
                <td className="border border-slate-300 px-4 py-2">Not Found - Resource not found</td>
              </tr>
              <tr>
                <td className="border border-slate-300 px-4 py-2">500</td>
                <td className="border border-slate-300 px-4 py-2">Internal Server Error</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </div>
  )
}
