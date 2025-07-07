import "./SongDeleteModal.css"

import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useModal } from '../../context/Modal';
import { useDispatch } from 'react-redux';
import { thunkGetOnePlaylist } from "../../redux/playlist";
import { thunkRemoveSong } from "../../redux/song";
import { IPlaylistId } from "../../redux/types/playlist";
import { ISongId } from "../../redux/types/song";

type SongDeleteModalProps={
  songId: ISongId
}
function SongDeleteModal({songId}: SongDeleteModalProps){

  const dispatch = useDispatch()
    const { closeModal } = useModal();
    const {id}=useParams()
    songId['playlistId']=Number(id)
    async function deleteSong(songId: ISongId){
      await dispatch(await thunkRemoveSong(songId))
      if(id){
      await dispatch(await thunkGetOnePlaylist(id))
      closeModal()
      }
    }


    return (
        <div className="song-delete-modal-div">
        
        <h1>Are you sure you want to delete this Song?</h1>
      <button className="delete-button" onClick={()=>{deleteSong(songId)}}>Delete</button>
      <button onClick={closeModal}>No</button>
        </div>
      );
    }


export default SongDeleteModal