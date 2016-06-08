$(function(){

    var todos = (localStorage.todos) ? (JSON.parse(localStorage.todos)) : [],
    state = localStorage.data || 'all',
    main = $('#main'),
    footer = $('#footer');
    
    main.hide();
    footer.hide();

    var saveData = function(){
    	localStorage.todos = JSON.stringify(todos);
    }

    var render = function(){
        if (todos.length > 0) {
            main.show();
            footer.show();
        };
        if (todos.length === 0) {
            main.hide();
            footer.hide();
        };
    	var ftodos = $.grep(todos,function(v){
			if( state === 'all' ){
				return v
			}else if( state === 'active'){
				return !v.isDone
			}else if( state === 'completed'){
				return v.isDone
			}
		})
    	$('#todo-list').empty().append( function(){
    		return $.map(ftodos,function(v){
                var tmp = v.isDone ? 'checked' : ''
                return '<li class="'+(v.isDone ? 'completed' : '')+'" data-id="'+v.id+'"><div class="view"><input class="toggle" type="checkbox" '+tmp+'><label for="">'+v.content+'</label><button class="destroy"></button></div><input type="text" class="edit" value="'+v.content+'"></li>'
    		})
    	})
        $('#filters .selected').removeClass('selected')
        $('footer a[data-role='+state+']').addClass('selected')
		$('#todo-count strong').text(ftodos.length)
    }
    render()
    
    var piliang = function(){
        if( $('.completed').length === 0){
            $('#clear-completed').css('opacity',0);
        }else{
            $('#clear-completed').css('opacity',1);
        }
    }
    piliang()

    var addTodo = function(e){
        var zhi = $.trim( $(this).val() )
        if( e.keyCode === 13 && $.trim(zhi) !== ''){
        	var todo ={
        		id: todos.length ? (Math.max.apply(null,$.map(todos,function(v){
                    return v.id
        		})) + 1 ) : 1001,
        		content:zhi,
        		isDone:false
        	}
        	todos.push(todo);
        	saveData();
        	$(this).val('');
        	render();
        }
    }
    $('#new-todo').on('keyup',addTodo)

    var deleteDoto = function(e){
        $(this).closest('li').remove();
        var id = parseInt($(this).closest('li').attr('data-id'));
        todos = $.grep(todos,function(v){
            return id !== v.id
        })
        saveData();
        render();
    }
    $('#todo-list').on('click','.destroy',deleteDoto)

    var changeinput = function(e){
        $(this).addClass('editing');
        $(this).find('.edit').focus();
    }
    $('#todo-list').on('dblclick','li',changeinput)

    $('#todo-list').on('focusout','.edit',function(){
    	$(this).closest('li').removeClass('editing');
    })

    var updateinput = function(e){
        var id = parseInt($(this).closest('li').attr('data-id'));
        var self = $(this);
        $.each(todos,function(i,v){
           if( v.id === id ){
                v.content = self.val();
           }
        })
        saveData();
        render();
    }
    $('#todo-list').on('change','.edit',updateinput)
    

    var all = function(){
        var length = $('.completed').length;
        if( length === todos.length ){
            console.log(1)
            $('#toggle-all').attr('checked','true');
        }
        if( length !== todos.length ){
            $('#toggle-all').removeAttr('checked');
        }
    }
    all();
 
    var changechecked = function(e){
        var state = $(this).prop('checked');
        var id = parseInt($(this).closest('li').attr('data-id'))
        $.each(todos,function(i,v){
        	if( v.id === id ){
        		v.isDone = state;
        	}
        })
        saveData()
        render()
        piliang()
        all()
    }
    $('#todo-list').on('click','.toggle',changechecked)

    $('#filters a').on('click',function(){
        $('#filters .selected').removeClass('selected')
        $(this).addClass('selected');
        state = localStorage.data = $(this).attr('data-role');
        render()
    })

    $('#clear-completed').on('click',function(){
    	$('li.completed').remove()
    	todos = $.grep(todos,function(v){
    		if( v.isDone === false ){
    			return v
    		}
    	})
    	saveData()
    	render()
    })

    $('#toggle-all').on('click',function(){
        var state = $(this).prop('checked');
        $.each(todos,function(i,v){
            v.isDone = state;
        })
        saveData()
        render()
        piliang()
    })


})