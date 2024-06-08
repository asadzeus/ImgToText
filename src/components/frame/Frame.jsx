import { useEffect, useState,useCallback } from 'react'
import './frame.css'
import { createWorker } from 'tesseract.js'
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {useDropzone} from 'react-dropzone'
import DeleteIcon from '@mui/icons-material/Delete';

const Frame = () => {

  const [selectedImage, setSelectedImage] = useState(null);
  const [textResult, setTextResult] = useState("Upload file to convert text.");
  const [copyT, setCopyT] = useState("Copy");
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback(acceptedFiles => {
     setSelectedImage(acceptedFiles[0]);
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  function handleImg (e) {
    setSelectedImage(e.target.files[0]);
  }

  async function convertImgToText(image) {
    const worker = createWorker({
      logger: m => {
        if (m.status === 'recognizing text') {
          let x = m.progress * 100;
          setProgress(x);
        }
      }
    });
    
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');

    let { data: { text } } = await worker.recognize(image);

    if(document.getElementById("hints1")) text = "Upload file to convert text."; 

    await worker.terminate();
    return text;
  }

  useEffect(() => {
    (async () => {
      if (selectedImage) {
        setTextResult("Uploading...");
        setProgress(0); 
        try {
          const text = await convertImgToText(selectedImage);
          setTextResult(text);
        } catch (error) {
          console.error("Error converting image to text:", error);
          setTextResult("Error converting image to text.");
        }
      }
    })();
  }, [selectedImage])

  function copyText(){
    navigator.clipboard.writeText(textResult);
    setCopyT("Copied");
    setTimeout(() => {
      setCopyT("Copy");
    }, 2000);
  }

  function deleteImg(){
    setSelectedImage(null);
    setTextResult("Upload file to convert text.");
  }

  return (
    
    <div className='frame'>
      <div className="container">
        <div className="title">Image To Text Converter</div>
        <div className="desc">Created by Alper Ertugrul</div> 
        
        <div className="bottom">

          <div className="left">

          <div {...getRootProps()} className='inputForm'>
            {selectedImage && 
              <img src={URL.createObjectURL(selectedImage)} alt="" className='img'/>
            }

          <input {...getInputProps()} />
          {
              !selectedImage  && !isDragActive && 
              <div className='hints1' id='hints1'><div>Drag or click to upload files.</div></div>    
          }
          {
              isDragActive  &&
              <div className='hints2'><div>Drop the files here ...</div></div>      
          }
        </div>

          <div className='deleteBtn' onClick={deleteImg}><DeleteIcon style={{fontSize:"33px", color:"white"}}/>Delete</div>
        </div>
        

          
        <div className="right">
          {selectedImage && progress > 0 && progress < 100 && (
            <div className="progress-bar-container">
              <div className='progress-bar-text'>{Math.floor(progress)} %</div>
              <div className="progress-bar" style={{width:`${progress}%`,height:"35px"}}></div>
            </div>
          )}

            <div className="text">{textResult}</div>
            <div className="copybtn" id='copybtn' onClick={copyText}><ContentCopyIcon/> {copyT}</div>
          </div>
        </div>

        
        
     
      </div>  
    </div>
  )
}

export default Frame

