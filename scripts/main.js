(function ($, BB, _) {

	$('#add_contact').tooltip();

	//var count = 0;
	var editContact;

	var App = Backbone.View.extend({
		el: "#contacts",
		events: {
			'click #add_contact': 'addPerson',
			'click .delete': 'deletePerson',
			'click .edit': 'editPerson',
			'click .done': 'savePerson',
			'click .cancel': 'cancelUpdate'
		},
		initialize: function () {
			this.input_name = $('#inputs input[name=fullname]');
			this.input_number = $('#inputs input[name=number]');
			this.input_username = $('#inputs input[name=username]');
			this.contacts_list = $('.table tbody tr:last-child');
			this.fields = $("input[type='text']");

			this.listenTo(this.collection,'add', this.createView);
			this.collection.fetch();
		},
		addPerson: function (evt) {
			var person = new PersonModel({
				name: this.input_name.val(),
				number: this.input_number.val(),
				username: this.input_username.val()
			});
			if (this.collection.where({username: this.input_username.val()}).length) {
				alert('Username already in use!');
				this.input_username.val('');
				this.input_username.addClass('focus');
			} else {
				this.collection.add(person);
				person.save();
			}
		},
		
		createView: function(model) {
			position = this.collection.indexOf(model) + 1;
			model.set("num", position);
			var view = new PersonView({model: model});
			this.contacts_list.before(view.render().el);
			clearField(this.fields);
		},

		deletePerson: function(evt) {
			var pos = parseInt($(evt.target).parents('tr').find('.position').text());
			var deleteContact = this.collection.findWhere({num: pos});
			deleteContact.destroy();
			$(evt.target).parents('tr').remove();
			
		},

		editPerson: function(evt) {
			//checkCurrentEditState();
			if($('#editing').length > 0 ) {
				$( ".cancel" ).trigger( "click" );
			} 
				position = parseInt($(evt.target).parents('tr').find('.position').text());
				editContact = this.collection.findWhere({num: position});
				//position = pos;
				var view = new editedPersonView({model: editContact});
				$(evt.target).parents('tr').replaceWith(view.render().el);
				$('.confirmation').parents('tr').attr('id','editing');
			
		},

		savePerson: function(evt) {
			var newname = $(evt.target).parents('tr').find('input[name=fullname]').val();
			var newnum = $(evt.target).parents('tr').find('input[name=number]').val();
			var newusername = $(evt.target).parents('tr').find('input[name=username]');
			if (this.collection.where({username: newusername.val()}).length) {
				alert('Username already in use!');
				newusername.val('');
				newusername.addClass('focus');
			} else {
				editContact.set({
					name: newname,
					number: newnum,
					username: newusername.val()
				});
				editContact.save();
				var view = new PersonView({model: editContact});
				$(evt.target).parents('tr').replaceWith(view.render().el);
			}	
		},

		cancelUpdate: function(evt) {
			var view = new PersonView({model: editContact});
			$(evt.target).parents('tr').replaceWith(view.render().el);
		}
	});

	function clearField(fields) {
		fields.val('');
	}

	var PersonModel = Backbone.Model.extend({
		idAttribute: '_id',
		defaults: {
			'name': '-',
			'number': '-',
			'username': '-'
		},
		initialize: function () {

		}
	});

	var PersonCollection = Backbone.Collection.extend({
		model: PersonModel,
		url: 'http://localhost:9090/contacts',
		initialize: function () {
			  
		}
	});

	var PersonView = Backbone.View.extend({
		tagName: 'tr',
		template: $('#contact_template').html(),
		initialize: function() {

		},
		render: function() {
			var compiledTemplate = _.template(this.template);
			this.$el.html(compiledTemplate(this.model.toJSON()))
			return this;
		}
	});

	var editedPersonView = Backbone.View.extend({
		tagName: 'tr',
		template: $('#edit_mode_template').html(),
		initialize: function() {

		},
		render: function() {
			var compiledTemplate = _.template(this.template);
			this.$el.html(compiledTemplate(this.model.toJSON()))
			return this;
		}
	});

	var contactApp = new App({collection: new PersonCollection()});



})(jQuery, Backbone, _)