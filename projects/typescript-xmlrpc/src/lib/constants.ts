import {MethodFault} from './xmlrpc-types';

export const applicationError: MethodFault = {faultCode: -1, faultString: 'Problem while processing data.'};
