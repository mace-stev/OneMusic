import "./Home.css"

function Home(){

    return(<>
    <div className="playlist-header">
        <h1>Playlist</h1>
        <button>Merge</button>
        <button>Upload</button>
        <button>transfer</button>
    </div>
    <div className="playlist-container-div">
        <div className="playlist-container"></div>
        <div className="apps-linked-container"></div>
    </div>
    
    </>)
}
export default Home;