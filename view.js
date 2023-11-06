// ---- Define your dialogs  and panels here ----



// ---- Display file structure ----

// (recursively) makes and returns an html element (wrapped in a jquery object) for a given file object
function make_file_element(file_obj) {
    let file_hash = get_full_path(file_obj)

    if(file_obj.is_folder) {
        let folder_elem = $(`<div class='folder' id="${file_hash}_div">
            <h3 id="${file_hash}_header">
                <span class="oi oi-folder" id="${file_hash}_icon"/> ${file_obj.filename} 
                <button class="ui-button ui-widget ui-corner-all permbutton" path="${file_hash}" id="${file_hash}_permbutton"> 
                    <span class="oi oi-lock-unlocked" id="${file_hash}_permicon"/> 
                </button>
            </h3>
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
            <span class="oi oi-file" id="${file_hash}_icon"/> ${file_obj.filename}
            <button class="ui-button ui-widget ui-corner-all permbutton" path="${file_hash}" id="${file_hash}_permbutton"> 
                <span class="oi oi-lock-unlocked" id="${file_hash}_permicon"/> 
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
    // open_advanced_dialog(perm_dialog.attr('filepath'))
    //open_permissions_dialog(path)

    // Deal with the fact that folders try to collapse/expand when you click on their permissions button:
    e.stopPropagation() // don't propagate button click to element underneath it (e.g. folder accordion)
    // Emit a click for logging purposes:
    emitter.dispatchEvent(new CustomEvent('userEvent', { detail: new ClickEntry(ActionEnum.CLICK, (e.clientX + window.pageXOffset), (e.clientY + window.pageYOffset), e.target.id,new Date().getTime()) }))
});

const current_task = $("#scenario_context").data("tag");
// add clearer directions in the side-panel
const sidebar = $("#sidepanel");
console.log(sidebar);
const ideas = $("<div id='help-list-69' class='help-list'><h3 class='help-title'>Read This Before Starting</h3></div>")
sidebar.append(ideas);
let steps;
switch (current_task) {
    case "remove_direct_permission":
        steps = ["Click on the lock next to <strong>importantfile.txt</strong>.", "Select 'employee3'", "Remove all of their 'allow' permissions.", "Select 'Deny' for 'all_permissions'.", "Click ok.", "Process complete"]
        break;
    case "add_new_user":
        steps = ["Click on the lock next to <strong>presentation_documents</strong>.", "Select 'Add...'", "Select 'employee4'", "Select 'Ok'", "Click ok.", "Process complete"]
        break;
    case "add_full_permissions":
        steps = ["Click on the lock next to <strong>presentation documents</strong>.", "Select 'Add...'","Select 'new_manager'", "click ok", "click 'new manager' under the group or users names column",
        "Look at the allow column and click the checkbox next to full_control", "Click ok.", "Process complete"]
        break;
    case "remove_inherited_permission":
        steps = ["Click on the lock next to <strong>importantfile.txt</strong>.","Select 'employee 3'", "click the check box that is next to modify <strong>that is also under the deny column</strong>", "Click ok.", "Process complete"]
        break;
    case "intern_permissions":
            steps = ["Click on the lock next to <strong>intern_subproject</strong>.", "Select 'intern'", "click the check box that is under the allow column that is also next to 'write'",
            "Click ok.", "Process complete"]
            break;
    case "remove_user_with_inheritance":
        steps = ["Click on the lock next to <strong>importantfile.txt</strong>.", "Select 'employee 3'", "click the check box that is next to the full control column <strong>and is also under the deny column</strong>",  "Click ok.", "Process complete"]
        break;
    case "restrict_group_member":
        steps = ["Click on the lock next to <strong>importantfile.txt</strong>.",
        "click 'advanced'",
            "click edit",
            "Click the change button.",
            "Select 'employee 3'",
        "click ok",
        " <strong>(***CHECK THIS CAREFULLY***)</strong>Under the allow column, check every box that has the word 'read'",
            "Under the deny column, check every box that was <strong>not</strong> checked on the left",
            "Click ok.",
            "close all the popups", "Process complete"]
        break;
        case "let_ta_modify":
            steps = ["Click on the lock next to <strong>Lecture_notes</strong>.", "Click Advanced", "click the bottommost checkbox",  "Click yes", "Click ok.", "Close the popups.", "Process complete"]
            break;
        case "lost_inheritance":
            steps = ["Click on the lock next to <strong>Lecture_notes</strong>.", "Click Advanced", "click the bottommost checkbox",  "Click yes", "Click ok.", "Close the popups.", "Process complete"]
            break;
    default:
        break;
}

const specificInstructions = $("<ol id='spec-instruct'> </ol>");
ideas.append(specificInstructions);

let index = 1;
steps.forEach(step => {
    const instruction = $(`<li id='step-${index}'> ${step} </li>`);
    specificInstructions.append(instruction);
});



// ---- Assign unique ids to everything that doesn't have an ID ----
$('#html-loc').find('*').uniqueId() 