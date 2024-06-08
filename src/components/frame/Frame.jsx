import { useState } from 'react'
import './frame.css'

const Frame = () => {

  const [selectedImage, setSelectedImage] = useState(null);

  return (
    
    <div className='frame'>
      
      <div className="container">
        <div className="title">Img To Text Converter</div>

        <label htmlFor="upload" className='btn'>Upload Image</label>
        <input type="file" id='upload' className="btn"/>  
        
        <div className="bottom">
          <div className="imgcontainer"><img src="./a.jpg" alt="" /></div>
          <div className="textcontainer">Up unpacked friendly ecstatic so possible humoured do. Ample end might folly quiet one set spoke her. We no am former valley assure. Four need spot ye said we find mile. Are commanded him convinced dashwoods did estimable forfeited. Shy celebrated met sentiments she reasonably but. Proposal its disposed eat advanced marriage sociable. Drawings led greatest add subjects endeavor gay remember. Principles one yet assistance you met impossible.</div>
        </div>
      </div>  
    </div>
  )
}

export default Frame

