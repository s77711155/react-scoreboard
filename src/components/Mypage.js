import React, {Component, ReactDOM} from 'react';
import {isAndroid, isIOS} from "react-device-detect";
import {Link} from 'react-router-dom';

export default class MyPageBase extends Component {
    constructor(props){
        super(props);
        this.state={
            memberName:'',
            memberStatus: 'INCLASS', //INCLASS - 수업중, HOLDING - 홀딩, END - 종강, NEW - 신규
            productName : '',
            lessonCount : '',
            startlessonDate :'',
            endlessonDate : '',
            couponAmount : '',
            mileageAmount : '',
            Nextlessonflag : false,
        }
    }

    componentWillMount() {
        console.log('componentWillMount (deprecated)');
        if(isAndroid){
            //window.testMessage.bottomMenuVisible(true);
        }

    }

    componentDidMount() {
        fetch(process.env.REACT_APP_API_URL + "/sign/refreshToken", {
            method: 'POST',
            headers:{
                'Content-Type':'application/json',
                'X-AUTH-TOKEN': localStorage.getItem('refreshToken')}
        })
            .then(response => response.json())
            .then(json => {
                if (json.result) {
                    if(json.status === 200){
                        localStorage.setItem('accessToken', json.data.accessToken);
                        this.tokenOK();
                    }
                } else {
                    console.log('!200', json.data);
                    this.props.history.push('/')
                }
            })
            .catch(console.log('error'));

    }
    tokenOK = () =>{
        fetch(process.env.REACT_APP_API_URL + "/myInfo/list", {
            method: 'GET',
            headers:{
                'Content-Type':'application/json',
                'X-AUTH-TOKEN': localStorage.getItem('accessToken')}
        })
            .then(response => response.json())
            .then(json => {
                if (json.result) {
                    this.setState({
                        'memberName': json.data.memberName,
                        'memberClass':json.data.memberClass,
                        'memberEmail':json.data.memberEmail,
                        'memberCellphone':json.data.memberCellphone,
                        "mktemailFlag": json.data.mktemailFlag,
                        "mktpushFlag": json.data.mktpushFlag
                    });
                    console.log(json.data)
                } else {
                    console.log('!200', json.data);
                    this.props.history.push('/')
                }
            })
            .catch(console.log('error 나는 회원정보'));

        fetch(process.env.REACT_APP_API_URL + "/lectureRoom/lessonStatus", {
            method: 'GET',
            headers:{
                'Content-Type':'application/json',
                'X-AUTH-TOKEN': v}
        })
            .then(response => response.json())
            .then(json => {
                console.log('memberStatus : ', json);
                if (json.result) {
                    if(json.status === 200){
                        this.setState({
                            memberStatus: json.data,
                        });
                        this.currentLesson();
                        this.rcmmndCourse();
                        //this.completeLesson();
                        if(json.data === 'INCLASS' && json.data!=='NEW'){
                            this.nextLesson();
                        }
                    }else{
                        alert('수업리스트 없음');
                    }
                } else {
                    alert('수업리스트 없음');
                }
            })
            .catch(console.log('error'));


        fetch(process.env.REACT_APP_API_URL + "/myInfo/purchase/list", {
            method: 'GET',
            headers:{
                'Content-Type':'application/json',
                'X-AUTH-TOKEN': localStorage.getItem('accessToken')}
        })
            .then(response => response.json())
            .then(json => {
                if (json.result) {
                    const lastPrd = json.data[0];
                    this.setState({
                        productName : lastPrd.productName,
                        lessonCount : lastPrd.lessonCount,
                        startlessonDate : lastPrd.startlessonDate,
                        endlessonDate : lastPrd.endlessonDate,
                        couponAmount : lastPrd.couponAmount,
                        mileageAmount : lastPrd.mileageAmount,

                    });
                    console.log(json)
                } else {
                    console.log('!200', json.data);
                    this.props.history.push('/')
                }
            })
            .catch(console.log('error _ 나는 수강정보'));
    };



    go = (t) =>{
        this.props.history.push('/'+t);
    };

    render() {
        return (
            <div className={'contentBox'}>
                {/*상단*/}
                <div>
                    <p>{this.state.memberName}님</p>
                    <Link to={'./'}>알람</Link>
                    <Link to={'./MemStting'}>설정</Link>
                </div>
                <div>
                    {/*결제여부 : 결제 전 / 후(수강상태로 구분)*/}
                    {/*수강상태 : 대기 / 수강중 / 종강 / 홀딩  에 다르게 나오는 것들이 다른데 어케 하는지?*/}
                    <div>
                        <p className={''}>{this.state.productName}[{this.state.lessonCount}]회차</p>
                        <p>{this.state.startlessonDate} ~ {this.state.endlessonDate}</p>
                        <p>{'결제상태'}</p>
                    </div>
                    {/*수강상태 : 대기 / 수강중 / 종강 / 홀딩  에 다르게 나오는 것들이 다른데 어케 하는지?*/}
                    <div>
                        <p className={''}>{this.state.productName}[{this.state.lessonCount}]회차</p>
                        <p>{this.state.startlessonDate} ~ {this.state.endlessonDate}</p>
                        <p>{'결제상태'}</p>
                    </div>
                    <div>
                        <p className={''}> <Link to={'./'}>영어 학습 계획세우고 내게 맞은 수강권 추천받으세요!﻿</Link> </p>
                        <p className={''}> <Link to={'./'}>수강신청﻿</Link> </p>
                    </div>
                    <div>
                        <p className={''}> <Link to={'./'}>언제 어디서나 다양한 강사와다시 유폰 시작해보세요!﻿</Link> </p>
                        <p className={''}> <Link to={'./'}>﻿수강권 추천받기﻿</Link> </p>
                    </div>

                    {/*수강중일때 다음 정기권이 잇냐없냐*/}
                    {state.productType === 'ML' &&
                    {
                        this.state.flag ?
                            <div><Link to={''}> 재수강하기 </Link></div>
                            :
                            <div>다음대기</div>
                    }
                    }
                    <div>
                        <p>수업쿠폰{this.state.couponAmount}장</p>
                        <p>적립금{this.state.mileageAmount}원</p>
                        <p>할인쿠폰{this.state}</p>
                    </div>
                </div>
                <div>
                    <p><Link to={''}>수강내역</Link></p>
                    <p><Link to={''}>수강신청</Link></p>
                </div>
            </div>
        );
    }
};
