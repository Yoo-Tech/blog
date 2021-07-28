$("#add-form").submit(function(event){
    alert("Data Inserted Successfully")
})

$("#edit-form").submit(function(event){
    alert("Data updated Successfully")
})


if(window.location.pathname== '/action'){
    $ondelete =$(".table tbody td a.delete");
    $ondelete.click(function(){
        // var id = $(this).attr("data-id")

        // var request = {
        //     "url": `http://localhost:3000/api/users/${id}`,
        //     "method": "DELETE"
        // }

        if(confirm("Do you really want to delete this record?")){
            $.ajax(request).done(function(response){
                alert("Data Deleted successfully")
                location.reload()
            })
        }
    })
}