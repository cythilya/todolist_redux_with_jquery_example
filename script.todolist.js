function findElement(id, array) {
  return array.map(function(element) {
    return element.id
  }).indexOf(id);
}

//Reducer：更新state的函式
const todos = (state = { todos: [], filter: 'all', counter: 0 }, actions) => {
  switch(actions.type) {
    case 'ADD_TODO':
      state.todos.push({
        id: state.counter++,
        name: actions.name,
        completed: false
      });
      break;
    case 'DELETE_TODO':
      state = Object.assign({}, state, state.todos.splice(findElement(actions.id, state.todos), 1));
      break;
    case 'EDIT_TODO':
      state.todos[findElement(actions.id, state.todos)].name = actions.name;
      break;
    case 'COMPLETE_TODO':
      state.todos[findElement(actions.id, state.todos)].completed = actions.completed;
      break;
    case 'INCOMPLETE_TODO':
      state.todos[findElement(actions.id, state.todos)].completed = actions.completed;
      break;
    case 'FILTER_COMPLETED':
      state.filter = 'completed';
      break;
    case 'FILTER_ALL':
     state.filter = 'all'
      break;
    default:
      break;
  }

  return state;
}

//Store：儲存state的地方
const todosStore = Redux.createStore(todos);

//Action：使用todosStore.dispatch來通知有事情發生，必須更新state
$('.add').click(() => {
  var newValue = $('.input_new_item').val();
  if(newValue) {
    todosStore.dispatch({
      type: 'ADD_TODO',
      name: newValue
    });
  }

  $('.input_new_item').val('');
});

$('.list').on('click', '.delete', function() {
  todosStore.dispatch({
    type: 'DELETE_TODO',
    id: $(this).parents('.item').data('id')
  });
});

$('.list').on('click', '.edit', function() {
  $(this).hide();
  $(this).parents('.item').find('.edit-block').show();
});

$('.list').on('click', '.submit', function() {
  var $item = $(this).parents('.item');

  todosStore.dispatch({
    type: 'EDIT_TODO',
    id: $item.data('id'),
    name: $item.find('.input-edit').val()
  });

  $item.find('.edit').show();
  $item.find('.edit-block').hide();
});

$('.list').on('change', '.complete-status', function() {
  var isCompleted = $(this).prop('checked');
  var actionType = 'INCOMPLETE_TODO';

  if(isCompleted) {
    actionType = 'COMPLETE_TODO'
  }

  todosStore.dispatch({
    type: actionType,
    id: $(this).parents('.item').data('id'),
    completed: isCompleted
  });

});

$('.filter-complete').click(() => {
  todosStore.dispatch({
    type: 'FILTER_COMPLETED'
  });
});

$('.filter-all').click(() => {
  todosStore.dispatch({
    type: 'FILTER_ALL'
  });
});

//監聽，當dispatch action執行造成state改變時就去取目前state內容，用來更新UI
todosStore.subscribe(() => {
  var state = todosStore.getState();
  var ResultHTML = '';

  for(var i = 0; i < state.todos.length; i++) {
    let HTML = '';
    let item = state.todos[i];
    let status = item.completed ? 'checked' : '';
    let hide = (state.filter === 'completed' && !item.completed) ? 'hide' : '';

    HTML += [
      '<li class="item ' + hide + '" data-id="' + item.id + '">',
      '  <input type="checkbox" class="complete-status"' + status +'>',
      '  <span class="name">' + item.name + '</span>',
      '  <span class="edit-block hide">',
      '    <input class="input-edit" />',
      '    <button class="submit">submit</button>',
      '  </span>',
      '  <button class="edit">edit</button>',
      '  <button class="delete">delete</button>',
      '</li>'
    ].join('');
    ResultHTML += HTML;
  }

  $('#todoList .list').html(ResultHTML);
});