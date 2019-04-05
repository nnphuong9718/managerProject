import React, { Component } from 'react';
import './App.css';
import TaskForm from './components/TaskForm';
import Control from './components/Control';
import ListView from './components/ListView';

class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            tasks: [],
            isDisplayForm : false,
            editTask : null,
            filter : {
                name : '',
                status : -1
            },
            search : '',
            sort:{
                by : 'name',
                value : 1
            }
        };
    }

    componentWillMount(){
        if(localStorage && localStorage.getItem('tasks'))
        {
            var tasks=JSON.parse(localStorage.getItem('tasks'));
            this.setState({
                tasks : tasks,
                isDisplayForm : false
            });
        }
    }
    s4(){
        return Math.floor((1+Math.random()) * 0x10000).toString(16).substring(1);
    }
    generateString(){
        return this.s4() + this.s4() + '-' +this.s4()+this.s4();
    }
    openTaskForm = () =>{
        if(this.state.isDisplayForm && this.state.editTask !== null){
            this.setState({
            isDisplayForm : true,
            editTask : null
            });
        }
        else{
            this.setState({
            isDisplayForm : !this.state.isDisplayForm,
            editTask : null
            });
        }
    }
    closeTaskForm = () =>{
            this.setState({
                isDisplayForm:false
            });
    }
    onShowForm = () =>{
        this.setState({
            isDisplayForm :true
        });
    }
    funcSubmit = (data) =>{
        var dataSubmit = this.state.tasks;
        if(data.id === ''){
            data.id = this.generateString();
            dataSubmit.push(data);   
        }
        else{
            var index= this.findIndex(data.id);
            dataSubmit[index] = data;
        }
        
        this.setState({
            tasks : dataSubmit
        });
        localStorage.setItem('tasks',JSON.stringify(dataSubmit));
    }
    updateStatus = (id) =>{
        var datas= this.state.tasks;
        var index = this.findIndex (id);
        if(index !== -1){
            datas[index].status = !datas[index].status;
            this.setState({
                tasks : datas
            });
        }
        localStorage.setItem('tasks',JSON.stringify(datas));
    }
    findIndex = (id) =>{
        var datas= this.state.tasks;
        var result = '';
        datas.forEach((data,index)=>{
            if(data.id === id){
                result = index;
            }
        });
        return result;
    }
    onDeleteItem = (id) =>{
        var datas=this.state.tasks;
        var index =this.findIndex(id);
        if(index !== -1){
            datas.splice(index,1);
            this.setState({
                tasks : datas
            });
        }
        localStorage.setItem('tasks',JSON.stringify(datas));
        this.closeTaskForm();
    }
    onUpdateData = (id) =>{
        var {tasks} = this.state;
        var index = this.findIndex(id);
        var editTask = tasks[index];
        this.setState({
            editTask : editTask,
        });
        this.onShowForm();
    }
    onFilter = (filterName , filterStatus) => {
        filterStatus = +filterStatus;
        this.setState({
            filter :{
                name : filterName.toLowerCase(),
                status :filterStatus
            }
        });
        
    }
    onSearch = (value) =>{
        this.setState({
            search : value
        });

    }
    onSort = (sortBy, sortValue) =>{
        console.log(sortBy + ' - ' + sortValue);
        this.setState({
            sort : {
                by :sortBy,
                value : sortValue
            }
        });
        console.log(this.state);
    }
    render() {
        let {tasks,isDisplayForm,editTask, filter, search,sort } = this.state;
        if(filter){
            if(filter.name){
                tasks = tasks.filter((task) => {
                    return task.name.toLowerCase().indexOf(filter.name) !== -1;
                });
            }
                tasks = tasks.filter((task)=>{
                    if(filter.status === -1){
                        return task;
                    }
                    else{
                        return task.status === (filter.status === 1 ? true : false);
                    }
                });
        }
        if(search){
            tasks= tasks.filter((task)=>{
                return task.name.toLowerCase().indexOf(search) !== -1;
            });
        }
        if(sort.by === 'name'){
            tasks.sort((a,b)=>{
                if(a.name > b.name) return sort.value;
                else if(a.name <b.name) return -sort.value;
                else return 0;
            });
        }else{
           tasks.sort((a,b)=>{
                if(a.status < b.status) return sort.value;
                else if(a.status > b.status) return -sort.value;
                else return 0;
           }); 
        }
        let displayForm = isDisplayForm 
                    ? <TaskForm
                        onReceiveDataSubmit = {this.funcSubmit} 
                        onReceiveData = {this.closeTaskForm}
                        task = {editTask}/> 
                    : '';
        return (
            <div className="container">
                <div className="text-center">
                    <h1>Quản Lý Công Việc</h1>
                    <hr/>
                </div>
            <div className="row">
                <div className={isDisplayForm ? 'col-xs-4 col-sm-4 col-md-4 col-lg-4' :''}>
                    {displayForm}
                </div>
                <div className={isDisplayForm ? 'col-xs-8 col-sm-8 col-md-8 col-lg-8' :'col-xs-12 col-sm-12 col-md-12 col-lg-12'}>
                    <button 
                            type="button" 
                            className="btn btn-primary"
                            onClick={this.openTaskForm}
                            >
                        <span className="fa fa-plus mr-5"></span>Thêm Công Việc
                    </button>
                        <Control 
                            onSearch ={this.onSearch}
                            onSort = {this.onSort}
                            />
                    <div className="row mt-15">
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <ListView 
                                tasks = {tasks} 
                                onUpdateStatus = {this.updateStatus}
                                onDeleteItem ={this.onDeleteItem}
                                onUpdateData = {this.onUpdateData}
                                filterData = {this.onFilter}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        );
    }
}
export default App;