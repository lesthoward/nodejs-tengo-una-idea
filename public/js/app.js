const $everyInput = document.querySelectorAll('input');
const $sidebar = document.querySelector('.sidebar');
// Sidebar
$sidebar.addEventListener('click', (e) => {
    if(e.target.id === 'open') {
        $sidebar.classList.toggle('sidebar__open')
    }
})

// Objetives List
const $wrapperList = document.querySelector('.wrapper__list');
if($wrapperList) {
    $wrapperList.addEventListener('click', (e) => {
        console.log(e.target);
        if(e.target.classList.contains('item')) {
            e.target.classList.toggle('item__open')
        }
    })
}

const btnShowIdea = document.querySelector('.show');
if(btnShowIdea) {
    btnShowIdea.addEventListener('click', () => {
        btnShowIdea.classList.toggle('show--open')
    })
}
// IDEA CONTAINER
const ideaContainer = document.querySelector('.idea__container')
if(ideaContainer) {
    ideaContainer.addEventListener('click', (e) => {
        if(e.target.classList.contains('idea__button--check')) {
            const idea = e.target.parentNode.parentNode
            idea.classList.toggle('idea--checked')
        }

        if(e.target.classList.contains('idea__title')) {
            e.target.parentNode.classList.toggle('idea__content--open')
        }
    })
}
