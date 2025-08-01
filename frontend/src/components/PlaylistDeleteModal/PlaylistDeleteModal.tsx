import "./PlaylistDeleteModal.css"
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useModal } from '../../context/Modal';
import { useDispatch } from 'react-redux';
import { thunkGetAllPlaylists, thunkRemovePlaylist } from "../../redux/playlist";
import { IPlaylistId } from "../../redux/types/playlist";

type PlaylistDeleteModalProps={
  playlistId: IPlaylistId
}

  function PlaylistDeleteModal({playlistId}: PlaylistDeleteModalProps) {
  
  const dispatch = useDispatch()
  const { closeModal } = useModal();
  async function deletePlaylist(id: IPlaylistId){
   await dispatch(await thunkRemovePlaylist(id))
    await dispatch(await thunkGetAllPlaylists())
    closeModal()
  }

    

  return (
    <div className="playlist-delete-modal-div" >
      <h1>Are you sure you want to delete this playlist?</h1>
      <button className="delete-button" onClick={()=>{deletePlaylist(playlistId)}}>Delete</button>
      <button onClick={closeModal}>No</button>
    </div>
  );
}


export default PlaylistDeleteModal