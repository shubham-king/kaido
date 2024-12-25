export default function ErrorPage({ statusCode }) {
    return (
        <div>
            <h1>{statusCode ? `Error ${statusCode}` : 'An error occurred'}</h1>
        </div>
    );
}

ErrorPage.getInitialProps = ({ res, err }) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
    return { statusCode };
};
