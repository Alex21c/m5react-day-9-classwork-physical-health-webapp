import { useEffect } from "react";
import ExerciseCard from "./ExerciseCard";
import { useState } from "react";
import { queries } from "@testing-library/react";

export default function PhysicalHealth(){
  // create a state to maintain fetched Exercises
    let initialState= {
      exercises : [],
      exercisesBK : [], // it will help when filter operation results are stored inside exercises to preserver Exercises
      api : {
        requestURL : "https://exercisedb.p.rapidapi.com/exercises",
        offset : 0, // means if offset is 10 that means fetch images from 11 to N
        limit : 10, // means how many images to fetch after offset
      },
      loadMoreBtnDisableStatus: '',
      loadMoreBtnText: 'Load More...'
    };
    let [stateExercises, updateStateExercises] = useState(initialState)
  
  function bkExercises(){
    updateStateExercises(previousState=>{
      return {
        ...previousState, 
        exercisesBK : [...previousState.exercises]
      };
    });
  }

  
  function restoreExercises(){
    updateStateExercises(previousState=>{
      return {
        ...previousState, 
        exercises : [...previousState.exercisesBK]
      };
    });
  }  

  function debounce(fxn, delay){
    let timerId;
    return function(){
      let context = this;
      let args=arguments;
      clearTimeout(timerId);
      restoreExercises();
      timerId = setTimeout(()=>{
        fxn.apply(context, args);
      }, delay);
    }
  }
  function searchExercise(event){
    let query = event.target.value;
    // safeguard
      if(query === ''){
        return ;
      }
   
      
    let results =  stateExercises.exercises.filter(exercise=> exercise.target.includes(query) || exercise.bodyPart.includes(query) || exercise.name.includes(query));
    updateStateExercises(previousState=>{
      return {
        ...previousState,
        exercises: [...results]
      }
    });

    console.log('searching ' + query);
  }


  async function makeAPICall(){
    updateStateExercises(previousState=>{
      return {
        ...previousState,
        loadMoreBtnDisableStatus: 'disabled',
        loadMoreBtnText: "Loading..."
      }
    });




    const url = `${stateExercises.api.requestURL}?offset=${stateExercises.api.offset}&limit=${stateExercises.api.limit}`; //https://exercisedb.p.rapidapi.com/exercises?offset=0&limit=20';
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '3ff36f16cemsh7d43acd82417501p18f64djsn5b33465ceaee',
        'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
      }
    };
    
    try {
      const response = await fetch(url, options);
      const result = await response.json();
      console.log(result);
      // now increase the offset value, and append exercises
        updateStateExercises(previousState=>{
          return {
            ...previousState,
            api: {
              ...previousState.api,
              offset : previousState.api.offset + previousState.api.limit
            },
            exercises : [...previousState.exercises, ...result]
          }
        });
    } catch (error) {
      console.error(error);
    } finally {
        
      updateStateExercises(previousState=>{
        return {
          ...previousState,
          loadMoreBtnDisableStatus: '',
          loadMoreBtnText: "Load More..."
      
        }
      });

      // and as well backup
        bkExercises();
    }

    
  }
  useEffect(()=>{
    // make an api call once to fetch the exercises
     makeAPICall();



  },[]);

  useEffect(()=>{

     console.log(stateExercises);


  },[stateExercises]);


  return (
    <div className="flex flex-col items-center mb-[3rem] m-[1rem]">
      <input className="text-stone-900 transition outline outline-2 
      outline-stone-300 focus:outline-yellow-500 p-[.5rem]   rounded-md" type="search" placeholder="Search Exercise" onChange={debounce( (event)=>searchExercise(event), 1000)} />
      

      {
        stateExercises.exercises.map((exercise, idx)=><ExerciseCard key={idx} exercise={exercise} idx={idx+1}/>)
      }
      
      
      <button disabled={stateExercises.loadMoreBtnDisableStatus} onClick={makeAPICall} className="font-semibold flex gap-[1rem] items-center justify-center outline outline-2 outline-amber-50 bg-yellow-300 hover:bg-yellow-500 transition cursor-pointer p-[1rem] rounded-md hover:text-slate-50 text-slate-900 text-[1.5rem]" type="submit">
        <i className="fa-solid fa-cloud-arrow-down"></i>
        <span>{stateExercises.loadMoreBtnText}</span>
        </button>

    </div>
  );
}