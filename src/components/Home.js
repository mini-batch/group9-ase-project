import React from "react";

function Home() {
    document.body.style.backgroundColor = 'rgba(182, 122, 11, 0.342)'
    return (
        <div className="home">
            <div className="container">
                <div className="row align-items-center">
                    <h1>
                        Group 9 Home Page
                    </h1>
                </div>
                <div className="row pt-4">
                    <h2>
                        Group Members:
                    </h2>
                </div>
                <div className="row align-items-center">
                    <p>
                        Arjun Yohann Joshua, Bhavik Pandya, David Hugh Batchelder, Gavin Yan, Haoran Tang, Yisong Liu
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Home;