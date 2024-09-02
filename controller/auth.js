const { StatusCodes } = require('http-status-codes')
const User = require('../db_models/user')
const Consultation = require('../db_models/consultation')
const wordExtractor = require('word-extractor')
require("dotenv").config();


const {Configuration, OpenAIApi,OpenAI} = require("openai");
const client = new OpenAI({
    apiKey: process.env.OPEN_AI_KEY, // This is the default and can be omitted
  });

let prompt = `Assume the role of an health practitioner who just had an online consultation with a patient.
summarise this consultation transcript:${client}
`



patient_custom_function = [{
    'name': 'extract_consulation_information',
    'description': 'Get the consultation transcript from the body of the input text',
    'parameters':{
        'type': 'object',
        'properties': {
            'condition':{
                'type':'string',
                'description':'the primary health condition the patient described as a single word'
            },
            'follow_up':{
                'type':'string',
                'description':'the next possible date in days, hours, weeks, months, or years to follow up with the patient as suggested by the health consultant'
            },
            'summary': {
                'type':'string',
                'description': 'The summary of the overall the conversation describing the patient;s reported issue'
            }
            
    }
    }  
    }]





/**
 * const page= (req, res)=>{
    //res.status(201).sendFile(path.join(__dirname,'build','index.html'))
    res.status(201).sendFile('index.html',{root:'build'}) 
}
 * 
 */


const login = async (req,res)=>{
    const {personnel_ID,password} = req.body
    
    const user  = await User.findOne({personnel_ID})
    //console.log(user)
//compare password
if(user!=null){
    const isPasswordCorrect = await user.comparePassword(password)

    if(!isPasswordCorrect){
      return res.status(StatusCodes.OK).json({passwordError:true,loggedIn:false}) 
    }
    return res.status(StatusCodes.OK).json({passwordError:false,loggedIn:true,user:user.name}) 
    
    
}
else{
    return res.status(StatusCodes.OK).json({personnelError:true,loggedIn:false}) 
}

}

//creating a new account 
const signup = async(req,res)=>{
console.log(req.body)
  
await User.create({ ...req.body })

.then(()=>{
    res.status(StatusCodes.CREATED).json({account_created:true})
})
.catch((error)=>{
    console.log(error)
    res.status(StatusCodes.CREATED).json({account_created:false})
})   
}

const findUser = async(req, res)=>{
   
    const user = await User.findOne(req.query) 
   
   
if(user){

    return res.status(StatusCodes.OK).json({userExist:true})
}
    res.status(StatusCodes.OK).json({userExist:false})
    
}


//saving GPT responses to database
const savingGPT = async (patientID, condition, appointment,summary,currentUser)=>{

let data = {id:patientID, condition:condition, followUp:appointment,summary:summary,addedBy:currentUser}
await Consultation.create(data)

.then(res=>{
console.log('new data added to consultation field in the database')
})

.catch(error=>console.log(error))

}



//GPT function

const summariser = async (patientID,currentUser, res,prompt)=>{
    let response =null;
    try {
    
        response = await client.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'gpt-3.5-turbo',
            functions:patient_custom_function
          });
        
        
    } catch (error) {
        return res.status(400).json({
            GPT:true,
            error:"OpenAI server not responding"
        })
    }

    if (response!=null){
        let condition =JSON.parse(response.choices[0].message.function_call.arguments).condition
        let appointment = JSON.parse(response.choices[0].message.function_call.arguments).follow_up
        let summary = JSON.parse(response.choices[0].message.function_call.arguments).summary

        savingGPT(patientID,condition,appointment,summary,currentUser)


        return res.status(200).json({status:'OK',message:'file uploaded successfully'})
    }

}




//uploading files and summarising it 
const extractor = async(req, res)=>{
    const {patientID,currentUser}= req.body  
    let description =''
    console.log(currentUser.name)
   //console.log(req.body)
   //console.log(req.file)
    if (req.file){
        const extractor = new wordExtractor();
        await extractor.extract(req.file.path)
        .then((doc)=>{
            description=doc.getBody().toString()
            summariser(patientID, currentUser, res, description)
        })
    
        //send to GPT to summarise
        


        //save in the database
        
    }
    else{
        return res.status(200).json({status:'error',message:'file not uploaded'})
    }
}



//fetching patients from database and sending to consultation section in the frontend

const fetchPatientNote = async(req, res)=>{

    const allPatient = await Consultation.find(req.query)
    if(allPatient){
        
        return res.status(200).json({patientFound:true,patient:allPatient})
    }
    
    //{addedBy:currentUser}
}


const page= (req, res)=>{
    //res.status(201).sendFile(path.join(__dirname,'build','index.html'))
    res.status(201).sendFile('index.html',{root:'build'}) 
}


module.exports={login,signup,findUser,extractor,fetchPatientNote,page}