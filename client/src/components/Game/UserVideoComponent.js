import React, { Component } from 'react';
import OpenViduVideoComponent from './OvVideo';

export default class UserVideoComponent extends Component {


    getNicknameTag() {
        return JSON.parse(this.props.streamManager.stream.connection.data).clientData;
    }

    render() {
        return (
            <div>
                    <div className="streamcomponent" >
                        <OpenViduVideoComponent streamManager={this.props.streamManager} />
                        <div>
                            {/* <p>{this.getNicknameTag()}</p> */}
                        </div>
                    </div>
            </div>
        );
    }
}