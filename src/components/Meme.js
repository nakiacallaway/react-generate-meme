import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
const Meme = () => {
  const [meme, setMeme] = useState({});
  const [memeData, setMemeData] = useState([]);
  // const [memeIndex, setMemeIndex] = useState(0);
  const [captions, setCaptions] = useState([]);
  let history = useHistory();

  useEffect(() => {

    const fetchMemes = async () => {
      try {
        let response = await fetch('https://api.imgflip.com/get_memes');
        response = await response.json();
        
        const { memes } = response.data;
        setMemeData(memes);
        
        setMeme(memes[0]);
        
      } catch (error) {
        console.log(error);
      }
    };

    fetchMemes();
  }, []);

  useEffect(() => {
    if (meme.id) {
      let caps = [];

      for (let i = 0; i < meme.box_count; i++) {
        caps.push('');
      }

      setCaptions(caps);
      
  }, [meme]);

  const setMemeComponent = () => {
    const randNum = Math.floor(Math.random() * memeData.length);
    setMeme(memeData[randNum]);
  };

  const updateCaptions = (e, index) => {
    const text = e.target.value || '';
    let updatedCaps = captions.map((c, i) => {
      if (index === i) {
        return text;
      } else {
        return c;
      }
    });
    
    setCaptions(updatedCaps);
  };

  const saveMeme = async () => {
    
    const memeData = new FormData();
    memeData.append('username', 'alkalilord');
    memeData.append('password', 'abc12345');
    memeData.append('template_id', meme.id);
    captions.forEach((c, index) => memeData.append(`boxes[${index}][text]`, c));
    
    try {
      let response = await fetch('https://api.imgflip.com/caption_image', {
        method: 'POST',
        body: memeData,
      });
      response = await response.json();
      console.log('in the try block', response);
      

      history.push(`/meme?url=${response.data.url}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className='row'>
      <div className='col-sm-12 col-md-4'>
        <form action=''>
          {captions.map((c, index) => {
            return (
              <div className='form-group' key={index}>
                <input
                  type='text'
                  placeholder={`Set Caption ${index + 1}`}
                  className='form-control'
                  onChange={e => updateCaptions(e, index)}
                />
              </div>
            );
          })}
        </form>
        <button
          className='btn btn-block btn-warning'
          onClick={setMemeComponent}>
          Skip
        </button>
        <button className='btn btn-success btn-block' onClick={saveMeme}>
          Save
        </button>
      </div>
      <div className='col-sm-12 col-md-8'>
        <div className='meme text-center'>
          {memeData.length > 0 ? (
            <img src={meme.url} alt={meme.name} />
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Meme;
