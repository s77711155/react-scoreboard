import React, {useEffect, useState} from 'react';
import api from '../../utils/api';

export const Heroes = (props) => {
  const [heroes, setHeores] = useState([]);

  useEffect(() => {
    getHeroes()
  }, []);

  // async 키워드를 붙이면 비동기로 동작
  // async 안에는 반드시 await가 있어야 한다.
  // await 뒤에는 반드시 Promise가 와야 한다.
  // await는 Promise가 리턴될때까지 기다렸다고 결과를 받아서 리턴
  const getHeroes = async () => {
    const protocol = '/api/user/heroes';
    const response = await api.get(`${protocol}`);
    console.log(response);
    setHeores(response.data.data);
  }

  return (
    <div className="row">
      {heroes.map(hero => (
        <div className="col-6 col-sm-4 col-md-3 p-1 p-sm-2 p-md-3" key={hero.id}>
          <div className="card">
            <img src={hero.photo ? hero.photo : process.env.PUBLIC_URL + '/images/baseline-face-24px.svg'}
                 style={{width: '100%'}} alt={hero.name}></img>
            <div className="card-body">
              <h5 className="card-title">{hero.name}</h5>
              <p className="card-text">email: {hero.email}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}