var getParameterData = function (elem) {
    return {
        Id: $(elem).children('.id').text(), 
        Name: $(elem).children('.name').text(),
        Description: $(elem).children('.description').text(),
        Value: $(elem).find('.value').text(),
        Type: $(elem).children('.type').text()
    }
}

var setType = function (type, value) {
    var val = value || '';
    if (type == 'System.String') {
        $('#value').val(val);
        $('#value').addClass('form-control')
        $('#value').attr('type', 'text');
        $('#value').attr('maxlength', 10);
    }
    else if (type == 'System.Int32') {
        $('#value').val(val);
        $('#value').addClass('form-control')
        $('#value').attr('type', 'number');
        $('#value').attr('max', 255);
        $('#value').attr('min', -255);
    }

    else if (type == 'System.Boolean') {
        var checked = value == 'True' ? true: false;
        $('#value').val('');
        $('#value').prop('checked', checked);
        $('#value').removeClass();
        $('#value').attr('type', 'checkbox');
    }
}

$(document).ready(function () {

    $('#download').on('click', function () {
        var data = {Parameters: []};
        $("tr[id^='parameter']").each(function (index, elem) {
            var parameter = getParameterData(elem);
            data.Parameters.push(parameter)
        });
        $.ajax('/upload/', {
            type : 'POST',
            contentType : 'application/json',
            data : JSON.stringify(data),
            success: function (response) {
                var string = (new XMLSerializer()).serializeToString(response.documentElement);
                var blob = new Blob([string]);
                var link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = "Output.xml";
                link.click();
            }
        });
    });

    $('#append').on('click', function () {
        $('#formHeader').text('Создание нового элемента')
        $("#form").modal('show')
    });

    $(".edit").on('click', function () {
        $('#formHeader').text('Редоктирование элемента')
        $("#form").modal('show')
        var tr = $(this).parent().parent();
        var data = getParameterData(tr);
        $('#id').val(data.Id)
        $('#name').val(data.Name)
        $('#description').val(data.Description)
        setType(data.Type, data.Value);
    });

    $('#type').on('change', function () {
        var type = $(this).val();
        setType(type);
    });

    $('.remove').on('click', function () {
        $(this).parent().parent().remove();
    });

    $('#save').on('click', function () {
        
    });
})