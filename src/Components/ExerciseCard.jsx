export default function ExerciseCard({exercise, idx}){
  return (
    <section className="wrapperExerciseCard my-[2rem] p-[2rem] bg-stone-100 shadow-xl rounded-md max-w-[70rem] m-[auto]">
      <h2 className="font-semibold text-[1.8rem] text-stone-900">#{idx} {exercise.name}</h2>
      
      <div className="wrapperExerciseImgAndDescription flex gap-[2rem] pt-[1rem]">
        <div className="exerciseImg min-w-[25rem] min-h-[25rem] rounded-full overflow-hidden">
          <img src={exercise.gifUrl} className=" object-contain w-[100%] h-[100%]"/>
        </div>

        <dl>
          <div>
            <dt className="font-semibold text-slate-900">Body Part</dt>
            <dd>{exercise.bodyPart}</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-900">Equipment</dt>
            <dd>{exercise.equipment}</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-900">Target</dt>
            <dd>{exercise.target}</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-900">Instructions</dt>
            <dd>{exercise.instructions.map((line, idx)=>(
              <span key={idx}>
                {`${idx+1}. ${line}`}
                <br/>
              </span>
            ))}
            </dd>
          </div>

          

        </dl>
      </div>
    </section>
  );
}