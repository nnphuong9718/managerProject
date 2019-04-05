import React, { Component } from 'react';

class TaskItem extends Component {
    onChangeStatus = () =>{
        this.props.updateItem(this.props.task.id);
    }
    onDeleteItem = () =>{
        this.props.onDeleteItem(this.props.task.id);
    }
    onUpdateData = () =>{
        this.props.onUpdateData(this.props.task.id);
    }
    render() {
        const {index, task}=this.props
        return (
            <tr>
                <td>{index + 1 }</td>
                <td>{task.name}</td>
                <td className="text-center">
                    <span 
                        className={task.status === true ? 'label label-danger' : 'label label-success'}
                        onClick = {this.onChangeStatus}>
                        {task.status === true ? 'Kích hoạt' : 'Ẩn'}
                    </span>
                </td>
                <td className="text-center">
                <button 
                    type="button" 
                    className="btn btn-warning"
                    onClick = {this.onUpdateData}>
                    <span className="fa fa-pencil mr-5"></span>Sửa
                </button>&nbsp;
                <button 
                    type="button" 
                    className="btn btn-danger"
                    onClick={this.onDeleteItem}>
                    <span className="fa fa-trash mr-5"></span>Xóa
                </button>
                </td>
            </tr>

        );
      }
}

export default TaskItem;
