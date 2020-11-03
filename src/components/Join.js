import React, { Component, createRef } from 'react';
import {Link} from 'react-router-dom'
import '../css/join.scss';
import PolicyInfo from "../component/PolicyInfo";
import PolicyUse from "../component/PolicyUse";
import Top from '../component/top';
import axios from "axios";
import moment from "moment";

export default class Join extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: "p1",
            pageT: '회원가입',
            chkAll: false,
            chkState: [false, false, false, false, false, false],
            chkNext: false,
            email : '',
            emailError: '',
            password : '',
            pwError: '',
            pwView: 'password',
            passwordCheck : '',
            pwChkError: '',
            pwChkView: 'password',
            name:'',
            nameError: '',
            cellPhone: '',
            cellPhoneError:'',
            companyCode: '',
            companyAuth:false,
            openCompany:false,
            CCodeError:'',
            pwChk: '',
            pwChk1: '',
            pwChk2: '',
            pwChk3: '',
            pwChk4: '',
            pop:'',

            authInput : '',//사용자 인증코드 입력 값
            authBtn: false,//인증코드 버튼 활성화
            authError:'',
            authTimeError:false,
            authCode:'', //인증코드
            authInfoView: false,//인증관련 안내
            disabled: false,//
            authState: false,//인증완료 상태
            authStart: '',
            authEnd: '',

            CCInput: false,
            CCbtn:true,

            emailDomain: ['naver.com', 'gmail.com', 'daum.net', 'hanmail.net', 'nate.com'],
            domainFilter: [],
            countMin :'10',
            countSec : '00',
            time: 600,
            active : '',
            isToggleOn: true,
            joinNext : false,
            passwordError : '',
            boxError: '',

            fstChk: 'on'
        };
    };

    //inputArielRef = React.createRef();
    //input Ref
    //비밀번호 확인
    inputPwChkRef = createRef();
    //이름
    inputNameRef = createRef();
    //휴대전화번호
    inputCellPhoneRef = createRef();
    //휴대전화 인증번호
    inputAuthRef = createRef();



    componentDidMount() { // 처음 랜더링 될때

    }
    componentWillUnmount() { // 컴포넌트 제거 후

    }

    listChk = (n) =>{
        const t = this.state.chkState;
        t[n] = !t[n];
        this.setState({chkState: t});
        this.chkChk(t);
    };
    listChkAll = () => {
        let c;
        if(this.state.chkAll) {
            c = [false,false,false,false,false,false];
        }else{
            c = [true,true,true,true,true,true];
        }

        this.setState({chkState: c});
        this.chkChk(c);
    };
    chkChk = (c) => {
        let a, b;

        c[0] && c[1] && c[2] ? a = true : a = false;
        c[0] && c[1] && c[2] && c[3] && c[4] && c[5]? b = true : b = false;

        this.setState({
            chkNext: a,
            chkAll: b
        })
    };


    next1 = () => {
        this.setState({
            pageT: '이메일 회원가입'
        });
        this.props.history.push('/join/p2');
    };

    next2 = () => {
        if(!this.state.chkNext){
            return null;
        }
        this.props.history.push('/join/p3');
    };

    inputPwRef = createRef();

    // Coustom Hook 이전
    onChangeName = (e) => {
        if(e.target.value.length <= e.target.maxLength){
            const t = e.target.value.replace(/[a-z0-9]|[\[\]{}()<>?|`~!@#$%^&*-_+=,.;:\"\\]|[\s*]/gi, "");
            //const t = e.target.value.replace( /[a-z0-9]|[\[\]{}()<>?|`~!@#$%^&*-_+=,.;:\"\\][ㄱ-ㅎ]/g,"");
            this.setState({
                name: t,
                nameError: '',
                authInfoView:false,
                authError: '',
                authInput: '',
                authCode: '',
                authState: false
            });
            if(this.state.authInput!==''&&this.state.authError===''&&this.state.authInput.length===6){
                this.setState({authInput: ''});
            }
            this.defaultDate(t);
        }
    };
    onBlurName = (e) => {
        const t = e.target.value;
        const nameRex = /^[가-힣]+$/;
        const a = nameRex.test(t);
        let v;

        if (t === '') {
            v = '필수 정보입니다.';
        } else if (t.length < 2 || t.length > 6) {
            v = '이름은 한글 2~6자까지 사용 가능합니다.';
        } else {
            a ? v = '' : v = '이름은 한글 2~6자까지 사용 가능합니다.';
        }
        this.setState({nameError: v});
        this.state.fstChk && this.setState({fstChk: ''});
    };

    onChangeEmail = (e) => { //이메일 input event
        const { value, name } = e.target; //ariel
        const v = e.target.value.replace(/[\s*]/gi, ''); //공백 replace?
        if(v === ''){this.setState({emailError: ''})} //email input 공백이면 emailError?
        this.state.fstChk && this.setState({fstChk: ''});
        this.setState({
            email: v,
            emailError: ''
        });
        this.onDomainFilter(e);
        this.defaultDate(v);
    };
    onBluremail = (e) => {
        const email_regex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/i; //이메일 형식 체크
        const bb = email_regex.test(e.target.value);
        let em = '';

        if(e.target.value.length === 0){
            this.setState({emailError: '필수 정보입니다.'});
            return null;
        }else{
            (bb) ? em = '' : em = '이메일 형식이 올바르지 않습니다.!';
        }
        this.setState({emailError: em});

        em === '' && this.chkEmail(e.target.value);
    };
    selDomain = (e) => {
        this.setState({
            email: e.target.innerText,
            active: '',
            emailError: ''
        });
        this.chkEmail(e.target.innerText)
    };

    chkEmail = (v) =>{
        axios({
            method:'GET',
            url: process.env.REACT_APP_API_URL + '/sign/checkId?',
            params: {
                "id": v,
            }
        })
            .then( (json) => {
                if(json.data.result){
                    if(json.data.message !== 'SIGN000007') {
                        this.eMessage('emailError', json.data.message);
                    }
                }
            })
            .catch( (error)=> {
                console.log(error);
            });
    };
    // 도메인 노출
    onDomainFilter =(e) => {
        let startindex = e.target.value.indexOf("@");
        let txt = e.target.value.substring(0,startindex);
        let f = e.target.value.substring(startindex+1, 99);
        let d = [];
        let cnt = 0;

        //도메인 필터 노출
        if (startindex !== -1) {
            this.state.emailDomain.map((v, n) => {
                d[n] = v.indexOf(f) === 0 ? txt+'@'+v : '';
                v.indexOf(f) === 0 && cnt++;
            });

        }
        console.log('cnt : ', cnt);
        this.setState({
            active: cnt === 0 ? '' : 'block',
            domainFilter: d
        });
    };
    clsDomail = () => {
        this.setState({
            active: ''
        });
    };

    onChangePhone = (e) => {
        const t = e.target.value;
        clearInterval(this.interval);
        if(t.length <= e.target.maxLength) {
            const v = this.formChk('cellphone', t);

            this.setState({
                authBtn: v[0],
                cellPhone: v[1],
                cellPhoneError: '',
                authInfoView:false,
                authError: '',
                authInput: '',
                authCode: '',
                authState: false
            });

            this.defaultDate(v[1]);
        }
    };
    onBlurPhone = (e) =>{
        let v = '';
        if(e.target.value === ''){
            v =  '필수 정보입니다.';
        }else if(!this.state.authBtn){
            v = '휴대전화번호 형식이 올바르지 않습니다. 정확하게 다시 입력해주세요.'
        }
        this.setState({
            cellPhoneError: v,
        });
    };

    formChk = (t, n) => {
        const phoneRex = /^\d{3}-\d{3,4}-\d{4}$/;
        let v = n;

        v = v.replace( /-/gi , '');

        if(v.length >= 2  &&  v.length <= 5 ){
            const nn =  /(\d{2})(\d{1,3})/;
            v.replace(nn, function(str, p1, p2){
                v = p1 + '-' + p2;
            });
        }else if(v.length >= 6 && v.length <= 9){
            const nn =  /(\d{2})(\d{1,3})(\d{1,4})/;
            v.replace(nn, function(str, p1, p2, p3){
                v = p1 + '-' + p2 + '-' + p3;
            });
        }else if(v.length === 10){
            // 일반전화이면서 서울일때
            if(v.substring(1, 2) === '2') {
                const nn =  /(\d{2})(\d{1,4})(\d{2,4})/;
                v.replace(nn, function(str, p1, p2, p3){
                    v = p1 + '-' + p2 + '-' + p3;
                });
            }else{
                const nn =  /(\d{3})(\d{1,3})(\d{2,4})/;
                v.replace(nn, function(str, p1, p2, p3){
                    v = p1 + '-' + p2 + '-' + p3;
                });
            }
        }else if(v.length > 10){
            const nn =  /(\d{3})(\d{1,4})(\d{2,4})/;
            v.replace(nn, function(str, p1, p2, p3){
                v = p1 + '-' + p2 + '-' + p3;
            });
        }
        const p = phoneRex.test(v);
        return [p, v];
    };

    onChangePassword = (e) => {
        const v = e.target.value.replace(/[\s*]/gi, '');

        this.setState({
            password: v,
            passwordError: ''
        });

        const eng = /[a-zA-Z]/;
        const num = /[0-9]/;
        const sym = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/;
        let flagEng = eng.test(e.target.value);
        let flagNum = num.test(e.target.value);
        let flagSym = sym.test(e.target.value);

        let p1, p2, p3, p4;

        // 비밀번호 8~16자 확인
        (v.length >= 8 && v.length <= 16) ? p1 = ' len' : p1 = '';
        // 영문
        (flagEng === true) ? p2 = ' eng' : p2 = '';
        // 숫자
        (flagNum === true) ? p3 = ' num' : p3 = '';
        // 특수문자
        (flagSym === true) ? p4 = ' sym' : p4 = '';

        this.setState({
            pwChk: p1 + p2 + p3 + p4,
            pwChk1: p1,
            pwChk2: p2,
            pwChk3: p3,
            pwChk4: p4
        });

        if(this.state.password.length !== 0){
            this.setState({passwordError: '', boxError: ''});
        }
    };
    onBlurPassword = (e) =>{
        if(this.state.password === ''){
            this.setState({passwordError: '필수 정보입니다.'});
            return null;
        }else if(this.state.pwChk1 === '' || this.state.pwChk2 === '' || this.state.pwChk3 === '' || this.state.pwChk4 === ''){
            this.setState({boxError: 'error'});
            return null;
        }else {
            this.setState({boxError: ''});
        }
        if(e && this.state.passwordCheck !== ''){
            this.onBlurPasswordChk();
        }
    };

    // 비밀번호 재확인
    onChangePasswordChk = (e) => {
        const v = e.target.value.replace(/[\s*]/gi, '');
        this.setState({
            passwordCheck: v,
            pwChkError: ''
        });
    };
    onBlurPasswordChk = (e) =>{
        let s;
        if(this.state.password === '') {
            s = '비밀번호를 먼저 입력해주세요.input';
        }else if (this.state.passwordCheck === '') {
            s = '필수 정보입니다.input';

        } else {
            this.state.password === this.state.passwordCheck ? s = '' : s = '입력한 비밀번호와 동일하지 않습니다.input';
        }
        this.setState({pwChkError: s});
        if(e && this.state.password !== ''){
            this.onBlurPassword();
        }
    };

    onClickPwView = (n) =>{
        let s;

        if(n===1){
            this.state.pwView === 'password' ? s = 'text' : s = 'password';
            this.setState({pwView: s})
        }else if(n===2){
            this.state.pwChkView === 'password' ? s = 'text' : s = 'password';
            this.setState({pwChkView: s})
        }
    };

    onChangeAuth = (e) =>{
        let v = e.target.value;

        if (v.length > 6) {
            v = v.slice(0, 6);
        }
        this.setState({
            authInput: v,
            authInfoView:true,
            authError: ''
        });

        clearInterval(this.interval);
        this.reqAuthCount();

        let m, t = true;
        if (v.length === 6) {
            if(v === this.state.authCode){
                m = '';
                t = false;
                clearInterval(this.interval);
                this.defaultDate(v);
            }
        }
        this.setState({
            authError: m,
            authInfoView:t,
        });
    };

    onBlurAuth = (e) =>{
        if(e.target.readOnly){
            return null;
        }

        let v = this.state.authInput;
        let m, t = true;

        if (v.length === 6) {
            // 인증번호랑 입력값 비교
            if(v === this.state.authCode){
                m = '';
                t = false;
                //clearInterval(this.interval);
            }else{
                m = '인증번호를 다시 확인해주세요.';
            }
        }else if(v.length === 0){
            m = '필수 정보입니다.';
        }else{
            m = '인증번호를 다시 확인해주세요.'
        }

        this.setState({
            authError: m,
            authInfoView:t,
        });
        this.defaultDate(e.target.value);
    };

    reqAuth = () =>{
        if(!this.state.authBtn){
            return null;
        }

        if(this.state.name === '') {
            this.setState({nameError: '필수 정보입니다.'});
            return null;
        }else if(this.state.nameError !== ''){
            this.setState({nameError: '한글 2~6자의 이름을 입력하고 재인증을 받아주세요.'});
            return null;
        }else{

        }

        clearInterval(this.interval);
        this.setState({
            disabled  : false,
            authTimeError:false,
            countMin :'10',
            countSec: '00',
            time: 600,
            authInfoView:false,
            authError: '',
            authInput: '',
            authCode: '',
            authState: false
        });

        fetch(process.env.REACT_APP_API_URL + "/sign/findId?memberName="+this.state.name+"&memberCellphone="+this.state.cellPhone.replace(/-/g, ''),{
            method:'POST',
            body: JSON.stringify({
                "memberCellphone": this.state.cellPhone.replace(/-/g, ''),
                "memberName": this.state.name,
            }),
            headers:{
                'Content-Type' : 'application/json;charset=UTF-8'
            }
        })
            .then(response => response.json())
            .then(
                json => {
                    //console.log(json);
                    if(json.result){
                        if(json.status === 200){
                            alert('이미 가입된 이름과 휴대전화번호입니다.');
                            return null;
                        }else{
                            this.reqAuthS();
                        }
                    }
                }
            )
            .catch((err) => {
                console.log(err);
                alert('서버 통신에 실패 하였습니다.');
            });
    };

    reqAuthS = () => {
        // 인증번호 발송
        axios({
            method:'get',
            url:process.env.REACT_APP_API_URL + '/sign/sendAuthNo?',
            params: {
                "cellPhone": this.state.cellPhone,
            }
        })
            .then( (json) => {
                this.setState({
                    authCode : json.data.message,
                    authInfoView: true,
                    authState:true,
                    authStart: moment() + 0,
                    authEnd: moment() + 600000
                });
                this.reqAuthCount();
            })
            .catch( (error)=> {
                console.log(error);
            });
    };

    reqAuthCount = () => {
        this.interval = setInterval(() => {
            this.timerHandler();
        }, 1000);
    };

    timerHandler = () => {
        const now = moment();

        if(now.diff(this.state.authStart) > 0 && now.diff(this.state.authEnd) < 0) {
            this.timesSetter();
        }else{
            this.setState({
                countSec: '00', //time - (countMin * 60),
                countMin :'00',
                disabled: true, // 시간이 지낫을때 인풋창 막기
                authTimeError:true,
                authCode: '',
                authInput: '',
                authStart: 0,
                authEnd: 0,
                authError: '유효시간이 지났습니다. 다시 인증을 진행해주세요.'
            });
            clearInterval(this.interval);
        }
    };

    timesSetter = () => {
        const now = moment();
        let s;
        let m;
        let t = now - this.state.authStart;
        t = 600 - Math.floor(t / 1000);
        m = Math.floor(t / 60);
        s = t - (m * 60);
        m === 0 ? m = '00' : m = '' + m;
        String(m).length === 1 ? m = '0' + m : m = '' + m;
        s === 0 ? s = '00' : s = '' + s;
        String(m).length === 1 ? s = '0' + s : s = '' + s;

        this.setState({
            countSec: s,
            countMin : m,
        });
    };

    onChangeCCode = (e) => {
        let cb = true;
        if(e.target.value.length > 0){
            cb = false;
        }
        this.setState({
            companyCode: e.target.value,
            CCodeError: '',
            CCbtn: cb
        });
    };

    onClickCom = () => {
        this.setState({
            openCompany: !this.state.openCompany,
            CCodeError : false
        });
    };

    chkCode = (e) => {

        if(e.target.className.indexOf('disable') >= 0){
            return null;
        }

        fetch(process.env.REACT_APP_API_URL + "/sign/checkB2b2c?companyCode="+this.state.companyCode)
            .then(response => response.json())
            .then(
                json => {
                    if(json.result === true && json.message === 'SIGN000005'){
                        this.setState({
                            CCodeError: '',
                            companyAuth: true,
                            CCInput: true,
                            CCbtn: true
                        })
                    }else{
                        this.setState({
                            CCodeError: '등록되지 않은 제휴코드 입니다.',
                            companyAuth: false,
                            CCInput: false
                        })
                    }
                }
            )
            .catch(err => console.log(err));

        e.preventDefault();
    };

    defaultDate = (e) =>{
        const t = this.state;
        // 필수 값에 따른 버튼 활성화
        if(t.emailError !== '' || t.passwordError !== '' || t.nameError !== ''/* || t.authError !== ''*/){
            this.setState({joinNext : false});
        }else if(t.email && t.password && t.name && t.authInput.length >= 5 && (t.authInput === t.authCode || e === t.authCode || e === t.authInput)) {
            this.setState({joinNext : true});
        }else{
            this.setState({joinNext : false});
        }
    };

    next3 = (e) => {
        if(e.target.className.indexOf('disable') > 0){
            return null;
        }

        const t = this.state;
        const c1 = !t.email ? '필수 정보입니다.' : t.emailError;
        const c2 = !t.password ? '필수 정보입니다.' : t.passwordError;
        const c3 = !t.passwordCheck ? '필수 정보입니다.' : t.pwChkError;
        const c4 = !t.name ? '필수 정보입니다.' : t.nameError;
        const c5 = !t.cellPhone ? '필수 정보입니다.' : t.cellPhoneError;
        const c6 = !t.authInput ? '필수 정보입니다.' : t.authError;
        let c7 = '';
        let cc = null;

        if(c1 !== ''){
            //이메일 focus
            this.emailRef.current.focus();
        }else if(c2 !== ''){
            //비밀번호 focus
            this.inputPwRef.current.focus();
        }else if(c3 !== ''){
            //비밀번호확인 focus
            this.inputPwChkRef.current.focus();
        }else if(c4 !== ''){
            //이름 focus
            this.inputNameRef.current.focus();
        }else if(c5 !== ''){
            //휴대전화번호 focus
            this.inputCellPhoneRef.current.focus();
        }else if(c6 !== ''){
            //휴대전화 인증번호 focus
            this.inputAuthRef.current.focus();
        }

        if(c1 !== '' || c2 !== '' || c3 !== '' || c4 !== '' || c6 !== '' || c7 !== '' ||
            t.pwChk1 === '' || t.pwChk2 === '' || t.pwChk3 === '' || t.pwChk4 === ''){
            return null;
        }

        this.setState({
            emailError: c1,
            passwordError: c2,
            pwChkError: c3,
            nameError: c4,
            cellPhoneError: c5,
            authError: c6
        });



        clearInterval(this.interval);
        this.state.CCInput? cc = this.state.companyCode : cc = null;

        fetch(process.env.REACT_APP_API_URL + "/sign/signUp",
            {
                method:'POST',
                body: JSON.stringify({
                    //"memberCellphone": this.state.cellPhone,
                    "memberCellphone": this.state.cellPhone.replace(/-/g, ''),
                    "memberEmail": this.state.email,
                    "memberId": this.state.email,
                    "memberName": this.state.name,
                    "memberenglishName": "not yet",
                    "password": this.state.password,
                    "lifelongFlag": this.state.chkState[3],
                    "mktemailFlag": this.state.chkState[4],
                    "mktsmsFlag": this.state.chkState[4],
                    "mktpushFlag": this.state.chkState[5],
                    "studyemailFlag": true,
                    "studypushFlag": true,
                    "studysmsFlag": true,
                    "companyCode" : cc
                }),
                headers:{
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(json => {
                console.log(json);
                if (json.result) {
                    if (json.status === 200) {
                        this.props.history.push('/join/p4');
                    } else {
                        //alert(json.message);
                        this.eMessage('alert', json.message);
                        return null;
                    }
                } else {
                    console.log(json.message);
                }
            })
            .catch(error => {
                console.log(error)
            })
    };

    openPop = (e) =>{
        window.scrollTo(0, 0);
        this.setState({pop:e.target.id});
    };
    clsPop = () =>{
        this.setState({pop:' '});
    };

    eMessage = (t, v) =>{
        axios({
            method:'get',
            url:process.env.REACT_APP_API_URL + '/commonMessage/getCommonMessage?',
            params: {
                "messageCode": v,
                "languageCode": "ko"
            }
        })
            .then((response) => {
                if(t === 'emailError'){
                    this.setState({emailError: response.data.message});
                }else{
                    alert(response.data.message);
                    return null;
                }
            })
            .catch( (error)=> {
                console.log(error);
            });
    };

    emailRef = createRef();

    onClickfChk = () => {
        this.setState({fstChk: ''})
    };


    render() {
        return (
            <div className={'join '+(this.props.match.params.page ? this.props.match.params.page : "p1")} onClick={this.clsDomail}>
                <Top title={this.state.pageT} sub={''} history={this.props.history}/>
                <div className='step1'>
                    <h1>유폰 회원가입하고<br/>특별함을 느껴보세요!</h1>
                    <h2>당신에게 딱 맞는 수업과 1:1로 진행되는<br/>체계적인 관리로 꾸준히 영어회화 하세요.</h2>
                    <button className='btn' onClick={this.next1}>이메일로 시작하기</button>
                    <button className='btn nalBtn' >네이버 아이디로 시작하기</button>
                </div>

                <div className='step2'>
                    <div className="contentTop">
                        <div className="bulStep1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="44" height="15" viewBox="0 0 44 15">
                                <g id="step1" transform="translate(-69 -80)">
                                    <rect width="27" height="2" transform="translate(77 87)" fill="#eee"/>
                                    <circle cx="5" cy="5" r="5" transform="translate(103 83)" fill="#ccc"/>
                                    <circle cx="7.5" cy="7.5" r="7.5" transform="translate(69 80)" fill="#8759f9"/>
                                    <text transform="translate(74 91)" fill="#fff"><tspan x="0" y="0">1</tspan></text>
                                </g>
                            </svg>
                        </div>
                        <div className="mainTxt">
                            <h1>환영합니다.</h1>
                            유폰 회원가입을 위해 <br/>
                            약관동의가 필요해요.
                        </div>
                    </div>
                    <div className='contentBox'>
                        <label className='labelchkAll'><input className='chkbox chkAll' type='checkbox' name='chkAll' onChange={this.listChkAll} checked={this.state.chkAll} /><span>모두 동의합니다</span></label>
                        <label><input className='chkbox c1' type='checkbox' name='c1' value='1' onChange={()=>this.listChk(0)} checked={this.state.chkState[0]} /><span>만 14세 이상입니다.</span></label>
                        <div className={'labelWrap'}>
                            <label><input className='chkbox c2' type='checkbox' name='c2' value='2' onChange={()=>this.listChk(1)} checked={this.state.chkState[1]} /><span>이용약관 동의</span></label>
                            <div className={'info'} id='info1' onClick={this.openPop}>내용보기</div>
                        </div>
                        <div className={'labelWrap'}>
                            <label><input className='chkbox c3' type='checkbox' name='c3' value='3' onChange={()=>this.listChk(2)} checked={this.state.chkState[2]} /><span>개인정보 수집 및 이용 동의</span></label>
                            <div className={'info'} id='info2' onClick={this.openPop}>내용보기</div>
                        </div>
                        <label><input className='chkbox c4' type='checkbox' name='c4' value='4' onChange={()=>this.listChk(3)} checked={this.state.chkState[3]} /><span>탈퇴시까지 회원유지 동의 (선택)</span></label>
                        <label><input className='chkbox c5' type='checkbox' name='c5' value='5' onChange={()=>this.listChk(4)} checked={this.state.chkState[4]} /><span>할인/이벤트 메일, SMS 수신 동의 (선택)</span></label>
                        <label><input className='chkbox c6' type='checkbox' name='c6' value='6' onChange={()=>this.listChk(5)} checked={this.state.chkState[5]} /><span>마케팅 정보 앱 푸시 알림 수신 동의 (선택)</span></label>
                    </div>
                    <button className={this.state.chkNext?'btn':'btn disable'} onClick={this.next2}>동의하고 계속 진행하기</button>
                    {/*<button className={this.state.chkNext?'btn':'btn disable'}><Link to="JoinStep3">동의하고 계속 진행하기</Link></button>*/}
                </div>

                <div className='step3'>
                    <div className="contentTop">
                        <p className="bulStep2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="44" height="15" viewBox="0 0 44 15">
                                <g id="step2" transform="translate(-69 -80)">
                                    <rect width="27" height="2" transform="translate(78 87)" fill="#eee"/>
                                    <circle cx="5" cy="5" r="5" transform="translate(69 83)" fill="#ccc"/>
                                    <circle cx="7.5" cy="7.5" r="7.5" transform="translate(98 80)" fill="#8759f9"/>
                                    <text transform="translate(102.5 91)" fill="#fff"><tspan x="0" y="0">2</tspan></text>
                                </g>
                            </svg>
                        </p>
                        <p className="mainTxt mt">
                            유폰 회원이 되기 위한 <br/>
                            정보를 알려주세요!
                        </p>
                    </div>
                    <div className='contentBox'>
                        <form>
                            <div className='inputTitle'>이메일</div>
                            <input tabIndex={1} ref={this.emailRef} className={'email ' + (this.state.emailError && 'error ') + (this.state.fstChk)} name='uemail' type='text' autoCapitalize='off' autoComplete='off' placeholder='abc@uphone.co.kr' value={this.state.email} onChange={this.onChangeEmail} onBlur={this.onBluremail} onClick={this.onClickfChk} />
                            <div className={`dsmFilter ${this.state.active === 'block'? 'block': ''}`}>
                                {this.state.domainFilter.map((v, n) => {
                                    return <p id={this.state.emailDomain[n]} onClick={this.selDomain} key={n}>{v}</p>
                                })}
                            </div>
                            {this.state.emailError && <div className='error'>{this.state.emailError}</div>}


                            <div className='inputTitle'>비밀번호</div>
                            <div className={'box'}>
                                <input tabIndex={2} ref={this.inputPwRef} autoComplete='password' className={'p1 ' + (this.state.passwordError && 'error ') + (this.state.boxError)} name='p1' type={this.state.pwView} placeholder='8~16자 영문, 숫자, 특수문자 사용' maxLength='16' value={this.state.password} onChange={this.onChangePassword} onBlur={this.onBlurPassword} onClick={this.onClickfChk} />
                                <div className={'viewIcon'} onClick={()=>this.onClickPwView(1)}>
                                    {this.state.pwView === 'password' ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="12.5" viewBox="0 0 16 12.5"><g id="icon_eye_off" transform="translate(-2387 -303.793)"><g id="패스_26" data-name="패스 26" transform="translate(2387 305)" fill="none"><path d="M8,0c4.418,0,8,5,8,5s-3.582,5-8,5S0,5,0,5,3.582,0,8,0Z" stroke="none"/><path d="M 8 1 C 4.998126029968262 1 2.321134567260742 3.767598628997803 1.27717113494873 5.001208782196045 C 1.654158592224121 5.447600841522217 2.245762825012207 6.094735145568848 2.99668025970459 6.743100166320801 C 4.189109802246094 7.772689819335938 6.025099754333496 9 8 9 C 11.00187397003174 9 13.67886543273926 6.232400894165039 14.72282981872559 4.998791217803955 C 14.34584140777588 4.552399158477783 13.75423717498779 3.905264854431152 13.00331974029541 3.256899833679199 C 11.81089019775391 2.227310180664063 9.974899291992188 1 8 1 M 8 0 C 12.41827964782715 0 16 5 16 5 C 16 5 12.41827964782715 10 8 10 C 3.581720352172852 10 0 5 0 5 C 0 5 3.581720352172852 0 8 0 Z" stroke="none" fill="#111"/></g><g id="타원_24" data-name="타원 24" transform="translate(2392 307)" fill="none" stroke="#111"><circle cx="3" cy="3" r="3" stroke="none"/><circle cx="3" cy="3" r="2.5" fill="none"/></g><line id="선_7" data-name="선 7" y1="11" x2="11" transform="translate(2389.5 304.5)" fill="none" stroke="#111"/></g></svg> : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="12.5" viewBox="0 0 16 12.5"><g id="icon_eye_on" transform="translate(-2387 -304)"><g id="패스_26" data-name="패스 26" transform="translate(2387 305)" fill="none"><path d="M8,0c4.418,0,8,5,8,5s-3.582,5-8,5S0,5,0,5,3.582,0,8,0Z" stroke="none"/><path d="M 8 1 C 4.998126029968262 1 2.321134567260742 3.767598628997803 1.27717113494873 5.001208782196045 C 1.654158592224121 5.447600841522217 2.245762825012207 6.094735145568848 2.99668025970459 6.743100166320801 C 4.189109802246094 7.772689819335938 6.025099754333496 9 8 9 C 11.00187397003174 9 13.67886543273926 6.232400894165039 14.72282981872559 4.998791217803955 C 14.34584140777588 4.552399158477783 13.75423717498779 3.905264854431152 13.00331974029541 3.256899833679199 C 11.81089019775391 2.227310180664063 9.974899291992188 1 8 1 M 8 0 C 12.41827964782715 0 16 5 16 5 C 16 5 12.41827964782715 10 8 10 C 3.581720352172852 10 0 5 0 5 C 0 5 3.581720352172852 0 8 0 Z" stroke="none" fill="#111"/></g><g id="타원_24" data-name="타원 24" transform="translate(2392 307)" fill="none" stroke="#111"><circle cx="3" cy="3" r="3" stroke="none"/><circle cx="3" cy="3" r="2.5" fill="none"/></g></g></svg>}
                                </div>
                            </div>
                            <div className={'pwChkListWrap' + this.state.pwChk}>
                                <div className={'pwChkList len'} ><svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="svg-inline--fa fa-check fa-w-16 fa-3x"><path fill="currentColor" d="M435.848 83.466L172.804 346.51l-96.652-96.652c-4.686-4.686-12.284-4.686-16.971 0l-28.284 28.284c-4.686 4.686-4.686 12.284 0 16.971l133.421 133.421c4.686 4.686 12.284 4.686 16.971 0l299.813-299.813c4.686-4.686 4.686-12.284 0-16.971l-28.284-28.284c-4.686-4.686-12.284-4.686-16.97 0z" className="" /></svg>8~16자</div>
                                <div className={'pwChkList eng'} ><svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="svg-inline--fa fa-check fa-w-16 fa-3x"><path fill="currentColor" d="M435.848 83.466L172.804 346.51l-96.652-96.652c-4.686-4.686-12.284-4.686-16.971 0l-28.284 28.284c-4.686 4.686-4.686 12.284 0 16.971l133.421 133.421c4.686 4.686 12.284 4.686 16.971 0l299.813-299.813c4.686-4.686 4.686-12.284 0-16.971l-28.284-28.284c-4.686-4.686-12.284-4.686-16.97 0z" className="" /></svg>영문</div>
                                <div className={'pwChkList num'} ><svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="svg-inline--fa fa-check fa-w-16 fa-3x"><path fill="currentColor" d="M435.848 83.466L172.804 346.51l-96.652-96.652c-4.686-4.686-12.284-4.686-16.971 0l-28.284 28.284c-4.686 4.686-4.686 12.284 0 16.971l133.421 133.421c4.686 4.686 12.284 4.686 16.971 0l299.813-299.813c4.686-4.686 4.686-12.284 0-16.971l-28.284-28.284c-4.686-4.686-12.284-4.686-16.97 0z" className="" /></svg>숫자</div>
                                <div className={'pwChkList sym'} ><svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="svg-inline--fa fa-check fa-w-16 fa-3x"><path fill="currentColor" d="M435.848 83.466L172.804 346.51l-96.652-96.652c-4.686-4.686-12.284-4.686-16.971 0l-28.284 28.284c-4.686 4.686-4.686 12.284 0 16.971l133.421 133.421c4.686 4.686 12.284 4.686 16.971 0l299.813-299.813c4.686-4.686 4.686-12.284 0-16.971l-28.284-28.284c-4.686-4.686-12.284-4.686-16.97 0z" className="" /></svg>특수문자</div>
                            </div>
                            {this.state.passwordError && <div className='error'>{this.state.passwordError}</div>}

                            <div className='inputTitle'>비밀번호 재확인</div>
                            <div className={'box'}>
                                <input tabIndex={3} ref={this.inputPwChkRef} autoComplete='off' className={'p2 ' + (this.state.pwChkError && 'error')} name='p2' type={this.state.pwChkView} maxLength={16} placeholder='입력한 비밀번호와 동일' value={this.state.passwordCheck} onChange={this.onChangePasswordChk} onBlur={this.onBlurPasswordChk} onClick={this.onClickfChk} />
                                <div className={'viewIcon'} onClick={()=>this.onClickPwView(2)}>
                                    {this.state.pwChkView === 'password' ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="12.5" viewBox="0 0 16 12.5"><g id="icon_eye_off" transform="translate(-2387 -303.793)"><g id="패스_26" data-name="패스 26" transform="translate(2387 305)" fill="none"><path d="M8,0c4.418,0,8,5,8,5s-3.582,5-8,5S0,5,0,5,3.582,0,8,0Z" stroke="none"/><path d="M 8 1 C 4.998126029968262 1 2.321134567260742 3.767598628997803 1.27717113494873 5.001208782196045 C 1.654158592224121 5.447600841522217 2.245762825012207 6.094735145568848 2.99668025970459 6.743100166320801 C 4.189109802246094 7.772689819335938 6.025099754333496 9 8 9 C 11.00187397003174 9 13.67886543273926 6.232400894165039 14.72282981872559 4.998791217803955 C 14.34584140777588 4.552399158477783 13.75423717498779 3.905264854431152 13.00331974029541 3.256899833679199 C 11.81089019775391 2.227310180664063 9.974899291992188 1 8 1 M 8 0 C 12.41827964782715 0 16 5 16 5 C 16 5 12.41827964782715 10 8 10 C 3.581720352172852 10 0 5 0 5 C 0 5 3.581720352172852 0 8 0 Z" stroke="none" fill="#111"/></g><g id="타원_24" data-name="타원 24" transform="translate(2392 307)" fill="none" stroke="#111"><circle cx="3" cy="3" r="3" stroke="none"/><circle cx="3" cy="3" r="2.5" fill="none"/></g><line id="선_7" data-name="선 7" y1="11" x2="11" transform="translate(2389.5 304.5)" fill="none" stroke="#111"/></g></svg> : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="12.5" viewBox="0 0 16 12.5"><g id="icon_eye_on" transform="translate(-2387 -304)"><g id="패스_26" data-name="패스 26" transform="translate(2387 305)" fill="none"><path d="M8,0c4.418,0,8,5,8,5s-3.582,5-8,5S0,5,0,5,3.582,0,8,0Z" stroke="none"/><path d="M 8 1 C 4.998126029968262 1 2.321134567260742 3.767598628997803 1.27717113494873 5.001208782196045 C 1.654158592224121 5.447600841522217 2.245762825012207 6.094735145568848 2.99668025970459 6.743100166320801 C 4.189109802246094 7.772689819335938 6.025099754333496 9 8 9 C 11.00187397003174 9 13.67886543273926 6.232400894165039 14.72282981872559 4.998791217803955 C 14.34584140777588 4.552399158477783 13.75423717498779 3.905264854431152 13.00331974029541 3.256899833679199 C 11.81089019775391 2.227310180664063 9.974899291992188 1 8 1 M 8 0 C 12.41827964782715 0 16 5 16 5 C 16 5 12.41827964782715 10 8 10 C 3.581720352172852 10 0 5 0 5 C 0 5 3.581720352172852 0 8 0 Z" stroke="none" fill="#111"/></g><g id="타원_24" data-name="타원 24" transform="translate(2392 307)" fill="none" stroke="#111"><circle cx="3" cy="3" r="3" stroke="none"/><circle cx="3" cy="3" r="2.5" fill="none"/></g></g></svg>}
                                </div>
                            </div>
                            {this.state.pwChkError && <div style={{color : 'red'}}>{this.state.pwChkError}</div>}

                            <div className='inputTitle'>이름</div>
                            <input tabIndex={4}ref={this.inputNameRef} autoComplete='name' className={'name ' + (this.state.nameError && 'error')} name='name' placeholder='김유폰' maxLength={7} value={this.state.name} onChange={this.onChangeName} onBlur={this.onBlurName} onClick={this.onClickfChk} />
                            {this.state.nameError && <div className='error'>{this.state.nameError}</div>}

                            <div className='inputTitle'>휴대전화번호</div>
                            <div className='authNumWrap'>
                                <input tabIndex={5} ref={this.inputCellPhoneRef} className={'cellPhone ' + (this.state.cellPhoneError && 'error')} name='cellPhone' maxLength={13} type='tel' placeholder='01012345678' value={this.state.cellPhone} onChange={this.onChangePhone} onClick={this.onClickfChk} onBlur={this.onBlurPhone}/>
                                <div className={'btn inputBtn authBtn '+ (!this.state.authBtn && 'disable')} onClick={this.reqAuth}>인증번호 받기</div>
                                {this.state.cellPhoneError && <div className='error'>{this.state.cellPhoneError}</div>}
                                <input ref={this.inputAuthRef} className={'authInput ' + (this.state.authError && 'error')} type='number' min='0' max='999999' placeholder='인증번호를 입력하세요' value={this.state.authInput} onChange={this.onChangeAuth}  disabled={this.state.disabled} onBlur={this.onBlurAuth} onClick={this.onClickfChk} readOnly={!this.state.authState} />

                                {this.state.authInfoView && <span className='timer'>유효시간 {this.state.countMin}분 {this.state.countSec}초</span>}
                            </div>
                            {(this.state.authInput!==''&&this.state.authError==='' && !this.state.authInfoView) && <div className={'completeTxt'}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="13.386" height="9.227" viewBox="0 0 13.386 9.227">
                                    <path d="M-419.842,158.372l4.058,3.988,7.207-7.417" transform="translate(420.903 -153.883)" fill="none" stroke="#50cbb5" />
                                </svg> 인증완료
                            </div> }
                            <div className={'authInfo ' + (this.state.authInfoView ? 'view' : 'hide')}>
                                <div className={'title'}>인증번호가 오지 않나요?</div>
                                <div className={'list'}>1. 휴대전화번호를 다시 확인해주세요.</div>
                                <div className={'list'}>2. 1588 번호가 스팸 문자로 등록되어 있으면 해제해주세요.</div>
                                <div className={'list'}>3. 가상전화번호는 인증번호를 받을 수 없습니다.</div>
                            </div>
                            {this.state.authError && <div className='error'>{this.state.authError}</div>}

                            <div className={'companyWrap '+this.state.openCompany}>
                                <div className='inputTitle'>제휴고객사 회원이라면?</div>
                                <div className='subArea'>
                                    <div className='openCode' onClick={this.onClickCom}>제휴코드 입력하기</div>
                                    <div className='clsCode' onClick={this.onClickCom}>닫기</div>
                                </div>
                                <input autoComplete='cCode' className={'cCode ' + (this.state.CCodeError && 'error')} name='cCode' placeholder='제휴코드 입력' readOnly={this.state.CCInput} value={this.state.companyCode} onChange={this.onChangeCCode} onClick={this.onClickfChk} />
                                <div className={'btn inputBtn ' + (this.state.CCbtn && 'disable')} onClick={this.chkCode}>등록</div>
                                {this.state.CCInput && <div className={'completeTxt'}><svg xmlns="http://www.w3.org/2000/svg" width="13.386" height="9.227" viewBox="0 0 13.386 9.227">
                                    <path d="M-419.842,158.372l4.058,3.988,7.207-7.417" transform="translate(420.903 -153.883)" fill="none" stroke="#50cbb5" />
                                </svg>등록완료</div>}
                            </div>
                            {this.state.CCodeError && <div className='error'>{this.state.CCodeError}</div>}
                        </form>
                    </div>
                    <button className={this.state.joinNext?'btn':'btn disable'} onClick={this.next3}>회원가입 완료</button>
                </div>

                <div className='step4'>
                    가입 완료
                    <Link to={'/'} className={'btn'}>메인가기</Link>
                </div>

                <div className={'popWrap ' + this.state.pop}>
                    <div className='infoPop info1'>
                        <div className='title'>이용약관</div>
                        <div className='clsBtn' onClick={this.clsPop}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="19.092" height="19.092" viewBox="0 0 19.092 19.092">
                                <g id="btn_close" transform="translate(0.707 0.707)">
                                    <line y2="25" transform="translate(17.678 0) rotate(45)" fill="none" stroke="#111" />
                                    <line y1="25" transform="translate(17.678 17.678) rotate(135)" fill="none" stroke="#111" />
                                </g>
                            </svg>
                        </div>
                        <div className={'content'}>
                            <PolicyUse />
                        </div>
                    </div>
                    <div className='infoPop info2'>
                        <div className='title'>개인정보처리방침</div>
                        <div className='clsBtn' onClick={this.clsPop}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="19.092" height="19.092" viewBox="0 0 19.092 19.092">
                                <g id="btn_close" transform="translate(0.707 0.707)">
                                    <line y2="25" transform="translate(17.678 0) rotate(45)" fill="none" stroke="#111" />
                                    <line y1="25" transform="translate(17.678 17.678) rotate(135)" fill="none" stroke="#111" />
                                </g>
                            </svg>
                        </div>
                        <div className='content'>
                            <PolicyInfo />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
