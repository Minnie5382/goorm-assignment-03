const input = document.querySelector('#username');
const userProfile = document.querySelector('.user_profile');
const latestRepos = document.querySelector('.latest_repos');
const repoTitle = document.querySelector('.repo_title');
const repoListElement = document.querySelector('.repo_list');

// username 입력했을 때 
input.addEventListener('keydown', getUser);

// 이벤트 
async function getUser(event) {
    if (event.keyCode === 13 || event.key === 'Enter') {
        const username = this.value;
         
        const res = await fetch(`https://api.github.com/users/${username}`);
        if (res) { // 이미 결과가 있을 경우
            userProfile.innerHTML = '';
            repoTitle.innerHTML = '';
            repoListElement.innerHTML = '';
        } 
        console.log(res);
        if(res.ok) {
            const data = await res.json();
            const user = new User(data);

            // user_profile 노드 추가
            const {avatarElement, userInfoElement} = createUserNodes(user);
            userProfile.appendChild(avatarElement);
            userProfile.appendChild(userInfoElement);

            // repo list 노드 추가
            const repoList = await getRepoList(username);
            repoList.forEach((repo) => {
                const repoItem = createRepoNodes(repo);
                repoListElement.appendChild(repoItem);
            });
        } 
        else {
            userProfile.innerHTML = `<div class="error">존재하지 않는 사용자입니다.</div>`;
            repoTitle.innerHTML = ``;
        }
    }
};

class User {    
    constructor(data) {
        let userPropertyList = ["id", "avatar_url", "followers", "following", "public_gists", "public_repos", "company", "location", "email", "blog"];
        userPropertyList.forEach((property) => {
            this[property] = data[property];
        });
    }
}

class Repo {
    constructor(data) {
        const userId = null;
        let repoPropertyList = ["id", "name", "html_url", "stargazers_count", "watchers_count", "forks"];
        repoPropertyList.forEach((property) => {
            this[property] = data[property];
        });
    }
}

// repo list 만드는 함수
async function getRepoList(username) {
    let repoList = [];
        const res = await fetch(`https://api.github.com/users/${username}/repos`);

        if (res.ok) {
            const repoTitle = document.querySelector('.repo_title');
            repoTitle.innerHTML = `Latest Repos`;
            let dataList = await res.json();

            dataList.forEach((data) => {
                let repo = new Repo(data);
                repo.userId = data.owner.id;
                repoList.push(repo);
            });
        } else { 
            console.log("error");
        }
        return repoList;
}

// 유저 노드 생성
function createUserNodes(user) {
    const avatarElement = document.createElement('div');
    avatarElement.classList.add('avatar');

    const avatarImageElement = document.createElement('img');
    avatarImageElement.setAttribute('src', user.avatar_url);

    const buttonElement = document.createElement('button');
    buttonElement.innerText = 'view profile';
    buttonElement.addEventListener('click', () => {
        window.location.href = user.avatar_url;
    });

    avatarElement.appendChild(avatarImageElement);
    avatarElement.appendChild(buttonElement);
    
    //user_info 노드
    const userInfoElement = document.createElement('div');
    userInfoElement.classList.add('user_info');

    //numbers 노드
    const numbersElement = document.createElement('div');
    numbersElement.classList.add('numbers');

    const followersElement = document.createElement('span');
    followersElement.classList.add('followers');
    followersElement.innerHTML = `Followers : `
    followersElement.innerHTML += `<span>${user.followers}</span>`;

    const followingElement = document.createElement('span');
    followingElement.classList.add('following');
    followingElement.innerHTML = `Following : `
    followingElement.innerHTML += `<span>${user.following}</span>`;

    const gistsElement = document.createElement('span');
    gistsElement.classList.add('gists');
    gistsElement.innerHTML = `Gists : `
    gistsElement.innerHTML += `<span>${user.public_gists}</span>`;

    const reposElement = document.createElement('span');
    reposElement.classList.add('repos');
    reposElement.innerHTML = `Repos : `
    reposElement.innerHTML += `<span>${user.public_repos}</span>`;


    // about 노드
    const aboutElement = document.createElement('div');
    aboutElement.classList.add('about');

    const companyElement = document.createElement('div');
    companyElement.classList.add('company');
    companyElement.innerHTML = `Company : `;
    user.company = user.company == null ? 'none' : `${user.company}`;
    companyElement.innerHTML += `<span>${user.company}</span>`;

    const locationElement = document.createElement('div');
    locationElement.classList.add('location');
    locationElement.innerHTML = `Location : `;
    user.location = user.location == null ? 'none' : `${user.location}`;
    locationElement.innerHTML += `<span>${user.location}</span>`;

    const emailElement = document.createElement('div');
    emailElement.classList.add('email');
    emailElement.innerHTML = `Email : `;
    user.email = user.email == null ? 'none' : `${user.email}`;
    emailElement.innerHTML += `<span>${user.email}</span>`;

    const blogElement = document.createElement('div');
    blogElement.classList.add('blog');
    blogElement.innerHTML = `Blog : `;
    user.blog = user.blog == '' ? 'none' : `${user.blog}`;
    blogElement.innerHTML += `<span>${user.blog}</span>`;

    userInfoElement.appendChild(numbersElement);
    numbersElement.appendChild(followersElement);
    numbersElement.appendChild(followingElement);
    numbersElement.appendChild(gistsElement);
    numbersElement.appendChild(reposElement);

    userInfoElement.appendChild(aboutElement);
    aboutElement.appendChild(companyElement);
    aboutElement.appendChild(locationElement);
    aboutElement.appendChild(emailElement);
    aboutElement.appendChild(blogElement);

    return {avatarElement, userInfoElement};
}

// 레포 노드 생성
function createRepoNodes(repo) {
        const repoItemElement = document.createElement('div');
        repoItemElement.classList.add('repo_item');

        const repoNameElement = document.createElement('span');
        repoNameElement.classList.add('repo_name');
        repoNameElement.innerHTML = `<a href="${repo.html_url}">${repo.name}</a>`;

        const repoInfo = document.createElement('div');
        repoInfo.classList.add('repo_info');

        const starsElement = document.createElement('span');
        starsElement.classList.add('stars');
        starsElement.classList.add('repo_info_item');
        starsElement.innerHTML = `Stars : `;
        starsElement.innerHTML += `<span>${repo.stargazers_count}</span>`;

        const watchersElement = document.createElement('span');
        watchersElement.classList.add('watchers');
        watchersElement.classList.add('repo_info_item');
        watchersElement.innerHTML = `watchers : `;
        watchersElement.innerHTML += `<span>${repo.watchers_count}</span>`;


        const forksElement = document.createElement('span');
        forksElement.classList.add('forks');
        forksElement.classList.add('repo_info_item');
        forksElement.innerHTML = `forks : `;
        forksElement.innerHTML += `<span>${repo.forks}</span>`;

        repoItemElement.appendChild(repoNameElement);
        repoItemElement.appendChild(repoInfo);

        repoInfo.appendChild(starsElement);
        repoInfo.appendChild(watchersElement);
        repoInfo.appendChild(forksElement);

        return repoItemElement;
}
