import { React , Component } from 'react';

import { Form, Button, Container, Row } from 'react-bootstrap';

import StopWatch from '../../components/stopwatch.component';

class RunPage extends Component  {
    constructor (props) {
        super(props)
        this.state = {
            orderId: '',
            operatorId: '',
            runTimeData: {
                status: false,
                runTime: 0,
                firstStart: 0,
                end: ''
            },
            machineBPM: 0,
            cansProduced: 0,
            errorMessage: '',
            orders: [],
            operators: []
        }
        this.handleChange = this.handleChange.bind(this)
    }

    componentDidMount() {
        // e.preventDefault();
        fetch('http://localhost:3500/run')
        .then(res => res.json())
        .then(result => {
            console.log(result);
            this.setState({
                orders: result.orders.map(x => [x.order_id, x.label_type]), 
                operators: result.operators.map(x => [x.operator_id,x.operator_name]),
                orderId: result.orders[0].order_id,
                operatorId: result.operators[0].operator_name
             });
            
        })
    }

    handleChange (e)  {
        this.setState({
            [e.target.id]: e.target.value
        });
        console.log(e.target.id)
        console.log(e.target.value);
    }

    handleClick () {
        if (this.state.runTimeData.status) {
            clearInterval(this.timerID)
        } else {
            // Set a start time for run as a whole
            if (this.state.runTimeData.firstStart === 0) {
                console.log('here')
                this.setState(prevState => ({
                    runTimeData : {
                        ...prevState.runTimeData,
                        firstStart: Date.now()
                    }
                }))
                console.log(this.state.runTimeData.firstStart)
            }

            // Stopwatch who update runtime everysecond and also the endtime
            const startTime = +new Date() - this.state.runTimeData.runTime;
            this.timerID = setInterval(() => {
                const runTime = Math.floor((+new Date() - startTime)/1000);
                this.setState(prevState => ({
                    runTimeData : {
                        ...prevState.runTimeData,
                        runTime: runTime,
                        end: +new Date()
                    }
                }))
            },1000)
            console.log('Start')
        }

        // Change status everytime button is clicked, to set correct labels on button
        this.setState(prevState => ({
            runTimeData : {
                ...prevState.runTimeData,
                status: !this.state.runTimeData.status
            }
        }))
    };

    handleReset() {
        console.log('Reset');
        clearInterval(this.timerID)
        this.setState(prevState => ({
            runTimeData : {
                ...prevState.runTimeData,
                status: false,
                runTime: 0
            }
        }))
    };

    handleSubmit(e) {
        e.preventDefault()
        console.log('submit')
        var data = this.state;
        console.log(data);
        fetch('http://localhost:3500/run', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(response => console.log('Succes', JSON.stringify(response)))
        .catch(error => console.log( 'Error', error))       
    }



    render () {
        return (
            <div> 
                <h1> Run Page</h1>
                <Container fluid='md'>
                    <Row fluid='md' className="justify-content-center">
                        <Form>
                            <Form.Group controlId="orderId">
                                <Form.Label>Order Id</Form.Label>
                                <Form.Control onChange={this.handleChange} as="select"> 
                                {this.state.orders.map(orderoption => <option key={orderoption[0]}> {orderoption[0]}</option>)}
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="operatorId">
                                <Form.Label>Operator Id</Form.Label>
                                <Form.Control onChange={this.handleChange} as="select"> 
                                {this.state.operators.map(operatoroption => <option key={operatoroption[0]}> {operatoroption[1]}</option>)}
                                </Form.Control>
                            </Form.Group>

                            <StopWatch 
                                handleClick={this.handleClick.bind(this)} 
                                handleReset={this.handleReset.bind(this)}
                                runTime={this.state.runTimeData.runTime}
                                status={this.state.runTimeData.status}

                            />
                            {/* <Form.Group controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Example textarea</Form.Label>
                                <div>
                                    <h1>Stopwatch</h1>
                                    <p> 0 ms </p>
                                    <Button>Start</Button>
                                    <Button>Reset</Button>
                                </div>
                            </Form.Group> */}

                            <Form.Group controlId="machineBPM">
                                <Form.Label>Machine BPM</Form.Label>
                                <Form.Control onChange={this.handleChange} type="number" placeholder='Machine BPM'/>
                            </Form.Group>

                            <Form.Group controlId="cansProduced">
                                <Form.Label>Amount of cans produced</Form.Label>
                                <Form.Control onChange={this.handleChange} type="number" placeholder='Cans Produced'/>
                            </Form.Group>

                            <Form.Group controlId="errorMessage">
                                <Form.Label>Error messsage</Form.Label>
                                <Form.Control onChange={this.handleChange} as="textarea" rows={3} placeholder="Describe production downtimes that were out of the ordinary, techincal difficulties, stock issues etc." />
                            </Form.Group>

                            <Button onClick={this.handleSubmit.bind(this)}variant="primary" type="submit">
                                Submit
                            </Button>
                        </Form>

                    </Row>
                </Container>
            </div>
        )
    }
};

export default RunPage;