export default function header()
{
    return (
        <>
        <div className="container my-5">
                <div className="p-4 bg-body-tertiary rounded-3 shadow-sm g-0 row" data-bs-theme="dark">
                    <div className="col-md-2 ms-4">
                        <img src="../images/scp-logo-deco.png" alt="scp-logo" id="logo" className="img-fluid float-start w-75" />
                    </div>
                    <div className="col-md-8">
                        <div className="card-body">
                            <h1 className="display-2 text-light">SCP Foundation</h1>
                            <p className="lead text-light">Secure, Contain, Protect</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}