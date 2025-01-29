import Spinner from 'react-bootstrap/Spinner';
import './../index.css';

function Loading() {
  return (
    <Spinner animation="border" role="status" className='loading-spinner'>
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  );
}

export default Loading;