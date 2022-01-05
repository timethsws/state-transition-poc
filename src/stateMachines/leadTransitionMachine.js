import {
	createMachine
} from "xstate";

var leadStateTransitionsJson = `[
	{
		"Name" : "UnsuccessfullyClosed",
		"Display" : "Unsuccessfully Closed",
		"Action" : "Close (Unsuccessful)",
		"NeedComment" : "1",
		"Entity" : "Lead",
		"From" : "New, Assigned, Reported, BlackListed, Qualified, Lodged, Declined, ConditionallyApproved, UnconditionallyApproved"
	},
	{
		"Name" : "New",
		"Display" : "",
		"Action" : "Create",
		"NeedComment" : "0",
		"Entity" : "Lead",
		"From" : ""
	},
	{
		"Name" : "SuccessfullyClosed",
		"Display" : "Successfully Closed",
		"Action" : "Close (Successful)",
		"NeedComment" : "0",
		"Entity" : "Lead",
		"From" : "UnconditionallyApproved"
	},
	{
		"Name" : "Declined",
		"Display" : "",
		"Action" : "Decline",
		"NeedComment" : "0",
		"Entity" : "Lead",
		"From" : "Lodged"
	},
	{
		"Name" : "Qualified",
		"Display" : "",
		"Action" : "Qualify",
		"NeedComment" : "0",
		"Entity" : "Lead",
		"From" : "Assigned, Declined, UnsuccessfullyClosed"
	},
	{
		"Name" : "Assigned",
		"Display" : "",
		"Action" : "Assign Broker",
		"NeedComment" : "0",
		"Entity" : "Lead",
		"From" : "New, Reported, Unassigned"
	},
	{
		"Name" : "UnconditionallyApproved",
		"Display" : "Unconditional Approved",
		"Action" : "Approve (Unconditional)",
		"NeedComment" : "0",
		"Entity" : "Lead",
		"From" : "Lodged, ConditionallyApproved"
	},
	{
		"Name" : "Reported",
		"Display" : "",
		"Action" : "Report",
		"NeedComment" : "0",
		"Entity" : "Lead",
		"From" : "Assigned"
	},
	{
		"Name" : "BlackListed",
		"Display" : "",
		"Action" : "BlackList",
		"NeedComment" : "0",
		"Entity" : "Lead",
		"From" : "Reported"
	},
	{
		"Name" : "Lodged",
		"Display" : "",
		"Action" : "Lodge",
		"NeedComment" : "0",
		"Entity" : "Lead",
		"From" : "Qualified"
	},
	{
		"Name" : "ConditionallyApproved",
		"Display" : "Conditional Approved",
		"Action" : "Approve (Conditional)",
		"NeedComment" : "0",
		"Entity" : "Lead",
		"From" : "Lodged"
	}
]
`

export const leadStateTransitionsDb = JSON.parse(leadStateTransitionsJson);

export const leadStateTransitionMachineFactory = (lead, guards) => {
	var initialState = leadStateTransitionsDb.find(st => st.From === "");
	//console.log(initialState)

	var statesMachine = {};

	// Create initial States
	leadStateTransitionsDb.forEach(element => {
		statesMachine[element.Name] = {}
	});
	//console.log(statesMachine)
	// Populate transitions
	leadStateTransitionsDb.forEach(element => {
		var transitions = element.From.split(',')
		console.log(element.Name, ' From States :', transitions)

		// If there are any guards
		var guard = undefined;
		if (guards) {
			guard = guards[`${element.Name}Guard`]
		}
		//console.log(transitions)
		transitions.forEach(tr => {
			tr = tr.trim()
			var state = statesMachine[tr]
			//console.log(state,tr)
			if (tr !== '') {

				if (state === undefined || state.on === undefined) {
					statesMachine[tr] = {
						on: {}
					}
					statesMachine[tr].on[element.Action] = {
						target: element.Name
					}
					//console.log(state.on)
				} else {
					statesMachine[tr].on[element.Action] = {
						target: element.Name
					}
				}
			}
			
			if(guard){
				statesMachine[tr].on[element.Action].cond = guard
			}

		})
	});

	//console.log(statesMachine)

	var stateMachineConfig = {
		id: 'd804342b-e270-4c3f-bc23-91f7643edf4c',
		context: lead,
		initial: initialState.Name,
		states: statesMachine
	}

	return createMachine(stateMachineConfig)
}

export const defaultGuards = {
	DefaultGuard: (lead) => lead,
	LodgedGuard: (lead) => {
		alert("lodge guard triggered")
		return lead.lodgementChecklistCompleted
	}
}