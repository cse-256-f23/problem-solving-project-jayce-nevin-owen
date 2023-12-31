// ---- Define your dialogs  and panels here ----



// ---- Display file structure ----

// (recursively) makes and returns an html element (wrapped in a jquery object) for a given file object
function make_file_element(file_obj) {
    let file_hash = get_full_path(file_obj)

    if(file_obj.is_folder) {
        let folder_elem = $(`<div class='folder' id="${file_hash}_div">
            <h2 id="${file_hash}_header">
                <span class="oi oi-folder force-right" id="${file_hash}_icon"/> ${file_obj.filename} 
                <button class="ui-button ui-widget ui-corner-all permbutton" path="${file_hash}" id="${file_hash}_permbutton"> 
                    <span class="oi oi-pencil" id="${file_hash}_permicon">Edit Permissions</span>
                </button>
            </h2>
        </div>`)

        // append children, if any:
        if( file_hash in parent_to_children) {
            let container_elem = $("<div class='folder_contents'></div>")
            folder_elem.append(container_elem)
            for(child_file of parent_to_children[file_hash]) {
                let child_elem = make_file_element(child_file)
                container_elem.append(child_elem)
            }
        }
        return folder_elem
    }
    else {
        return $(`<div class='file'  id="${file_hash}_div">
            <span class="oi oi-file force-right" id="${file_hash}_icon"/> ${file_obj.filename}
            <button class="ui-button ui-widget ui-corner-all permbutton" path="${file_hash}" id="${file_hash}_permbutton"> 
                <span class="oi oi-pencil" id="${file_hash}_permicon">Edit Permissions</span> 
            </button>
        </div>`)
    }
}

for(let root_file of root_files) {
    let file_elem = make_file_element(root_file)
    $( "#filestructure" ).append( file_elem);    
}



// make folder hierarchy into an accordion structure
$('.folder').accordion({
    collapsible: true,
    heightStyle: 'content'
}) // TODO: start collapsed and check whether read permission exists before expanding?


// -- Connect File Structure lock buttons to the permission dialog --

// open permissions dialog when a permission button is clicked
$('.permbutton').click( function( e ) {
    // Set the path and open dialog:
    let path = e.currentTarget.getAttribute('path');
    perm_dialog.attr('filepath', path)
    perm_dialog.dialog('open')
    
    // perm_dialog.open_advanced_dialog(perm_dialog.attr('filepath'))
    // open_advanced_dialog(perm_dialog.attr('filepath'))
    // open_permissions_dialog(path)

    // Deal with the fact that folders try to collapse/expand when you click on their permissions button:
    e.stopPropagation() // don't propagate button click to element underneath it (e.g. folder accordion)
    // Emit a click for logging purposes:
    emitter.dispatchEvent(new CustomEvent('userEvent', { detail: new ClickEntry(ActionEnum.CLICK, (e.clientX + window.pageXOffset), (e.clientY + window.pageYOffset), e.target.id,new Date().getTime()) }))
});

// add clearer directions in the side-panel
const sidebar = $("#sidepanel");
sidebar.addClass(" flush");

let headerST = $('<h3>').text("Helpful Tips.");

$('#sidepanel').append(headerST);
let bodyST = $('<ol>')
const rules = [
    "Permissions for a specific file override permissions from the folder. Make sure to change the permissions at the level the prompt specifies.",
    "You can make changes to permissions by clicking on the <strong>EDIT PERMISSIONS</strong> button next to the file/folder name."
]
rules.forEach(rule => {
    const info = $(`<li> ${rule} </li>`)
    bodyST.append(info);
})
$('#sidepanel').append(bodyST);


// ---- Assign unique ids to everything that doesn't have an ID ----

$('#html-loc').find('*').uniqueId() 