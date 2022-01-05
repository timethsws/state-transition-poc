import {
    createMachine
} from "xstate";

export const leadTransitionMachine = createMachine({
    id: 'd804342b-e270-4c3f-bc23-91f7643edf4c',
    context: {
        lead: {}
    },
    initial: 'New',
    states: {
        UnsuccessfullyClosed: {
            on: {
                Qualify: 'Qualified'
            }
        },
        New: {
            on: {
                'Close (Unsuccessful)': 'UnsuccessfullyClosed',
                'Assign Broker': 'Assigned'
            }
        },
        SuccessfullyClosed: {},
        Declined: {
            on: {
                'Close (Unsuccessful)': 'UnsuccessfullyClosed',
                Qualify: 'Qualified'
            }
        },
        Qualified: {
            on: {
                'Close (Unsuccessful)': 'UnsuccessfullyClosed',
                Lodge: 'Lodged'
            }
        },
        Assigned: {
            on: {
                'Close (Unsuccessful)': 'UnsuccessfullyClosed',
                Qualify: 'Qualified',
                Report: 'Reported'
            }
        },
        UnconditionallyApproved: {
            on: {
                'Close (Unsuccessful)': 'UnsuccessfullyClosed',
                'Close (Successful)': 'SuccessfullyClosed'
            }
        },
        Reported: {
            on: {
                'Close (Unsuccessful)': 'UnsuccessfullyClosed',
                'Assign Broker': 'Assigned',
                BlackList: 'BlackListed'
            }
        },
        BlackListed: {
            on: {
                'Close (Unsuccessful)': 'UnsuccessfullyClosed'
            }
        },
        Lodged: {
            on: {
                'Close (Unsuccessful)': 'UnsuccessfullyClosed',
                Decline: 'Declined',
                'Approve (Unconditional)': 'UnconditionallyApproved',
                'Approve (Conditional)': 'ConditionallyApproved'
            }
        },
        ConditionallyApproved: {
            on: {
                'Close (Unsuccessful)': 'UnsuccessfullyClosed',
                'Approve (Unconditional)': 'UnconditionallyApproved'
            }
        },
        Unassigned: {
            on: {
                'Assign Broker': 'Assigned'
            }
        }
    }
})