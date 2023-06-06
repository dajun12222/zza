// 222
const token ='eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsiYXBpIl0sImNvcnBJZCI6bnVsbCwidXNlcl9pZCI6IjJjMmM4MDg0ODExZWNhODkwMTgxNjVkNmFkYzMyOGQ0IiwidXNlcl9uYW1lIjoibXp0Iiwic2NvcGUiOlsicmVhZCJdLCJtb2JpbGUiOmZhbHNlLCJpc0FkbWluIjp0cnVlLCJleHAiOjE2ODU2OTc3MjQsImlzQXBwQWRtaW4iOmZhbHNlLCJhdXRob3JpdGllcyI6WyJVU0VSIiwiQVVUSF9TWVNURU1fTUFOQUdFIl0sImp0aSI6IjUyYmU1ODUyLWMxOWQtNDU3YS04NmYzLTllZTQ4YWViZWU4NSIsImNsaWVudF9pZCI6ImFwaSJ9.WDxd6xmjDjK3ezBEMoYHyKikuHo1Ti3rdkVkpIq6B2zJXYv1fY5J_i1gRgvCy_pAcbIcnRurWZ6cvXvUq1_8idtwkYbE91Nq43N-6wXFPHaAMzYwGRsCAPOTPQfYg5pel3j9y0mPaKSy8DPkp9E295JL1arZmYzFWL4g8U6Qhsw'



const setDevToken = () => {
    if(process.env.NODE_ENV === 'development') {
        localStorage.setItem('token', token);
    }
}

const frontendVersion = '6.13.0';
console.log(`%cfrontendVersion:${frontendVersion}`, 'color: green;font-size: 16px');

//设置开发环境token
module.exports = setDevToken;
