import { Link, useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  //console.error(error);

  return (
    <div id="error-page" className="flex flex-col justify-center items-center h-[100vh]">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
        <i>{error.statusText || error.message}</i>
        <Link to="/">
            <button className="bg-green-700 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
                Go back to the homepage</button>
        </Link>
    </div>
  );
}