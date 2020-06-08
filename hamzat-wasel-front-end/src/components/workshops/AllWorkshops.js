import React,{ Component} from 'react';
import axios from 'axios';
import config from '../token/token';

class AllWorkshops extends Component {
    constructor(props){
        super(props)
            
        this.state = { 
            workshops: [], 
        }
    }

    handleChange = ({target}) =>{
        this.setState({ ...this.state, [target.name]: target.value });
        console.log(target);   
    };
        
    componentDidMount (){ 
        axios.get('http://localhost:8000/sanctum/csrf-cookie').then(response => {
            // console.log(response);
            axios.get('http://localhost:8000/api/workshops').then(res => {
                console.log(res.data.data);
                this.setState({ workshops: res.data.data})
                    
            }).catch(error => {
                console.log(error.response)
            }); 
        });
    };

    onWorkshopDeleted = workshopId => { 
        axios.get('http://localhost:8000/sanctum/csrf-cookie').then(response => {
            // console.log(response);
            axios.delete('http://localhost:8000/api/workshops/'+ workshopId,config).then(res => {
                console.log(res.data);
			    let workshops = this.state.workshops;
                function removeWorkshop(arr, value) {
                    return arr.filter((workshop)=>{
                    return workshop.id !== value; });
                }
            
                this.setState({workshops:removeWorkshop(workshops,workshopId)});     
                // setTimeout(() => this.setState({alert_message:''}), 9000);

            }).catch(error => {
                // this.setState({alert_message: "error"});
                // setTimeout(() => this.setState({alert_message:''}), 9000);
                console.log(error)
            });
        });
    };


render() { 
    return ( 
    <div className="container">
        <div className="row">
            {this.state.workshops.map(workshop => { return (
            <div className="col-md-6 col-xs-12" key={workshop.id}>
                <div className="card border-info mb-3">
                    <div className="bg-transparent border-info">
                        <div className="card-header bg-transparent border-info">          
                            <h5 className="text-info m-3">{workshop.title} 
                                <span className="badge badge-primary float-right"> 
                                    {workshop.category_info.category_name}
                                </span>
                            </h5>  
                        </div>
                        <div className="card-body bg-transparent border-info text-left">  
                            <h5 className="card-text">
                                <span className="badge badge-info p-1 m-1"> 
                                Description:
                                </span> 
                                {workshop.description}
                            </h5> 
                            <h5 className="card-text">
                                <span className="badge badge-info p-1 m-1">
                                Number of attendees: 
                                </span> 
                                {workshop.capcity}
                            </h5> 
                            <h5 className="card-text">
                                <span className="badge badge-info p-1 m-1">
                                Mentor: 
                                </span> 
                                {workshop.mentor_info.name}
                            </h5> 
                            <h5 className="card-text">
                                <span className="badge badge-info p-1 m-1">  
                                price: 
                                </span>
                                {workshop.workshop_price} EGP
                            </h5>
                            <button onClick={()=>{ if 
                            (window.confirm('Are you sure you want to delete this workshop?'))
                            this.onWorkshopDeleted(workshop.id)}} 
                            className="btn btn-danger font-weight-bold m-1"> Delete </button>
                        </div>
                        <div className="card-footer bg-transparent border-info">
                                <small className="text-info m-2">From:  {workshop.start_date}</small>
                                <br />
                                <small className="text-danger m-2">To:  {workshop.end_date}</small>
                        </div>
                    </div>        
                </div>
            </div>
                );
                })
            }    
        </div>        
    </div>  
    );
    }
}

 
export default AllWorkshops;