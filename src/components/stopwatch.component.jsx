import { Component } from 'react';
import { Button } from 'react-bootstrap';

class StopWatch extends Component {
        
    render () {
        const { handleClick, runTime, handleReset, status } = this.props;
        return (
                <div>
                    <p> {runTime} </p>
                    <Button onClick={handleClick}> {status ? 'Stop' : 'Start'}</Button>
                    <Button onClick={handleReset}> Reset </Button>
                </div>

            )
    }
}

export default StopWatch;