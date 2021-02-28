const conditional = (props)=>{
    if(props.condition){
        return(
            <div> 
                {props.children}
            </div>
        );
    }
    else{
        return null;
    }
};

export default conditional;