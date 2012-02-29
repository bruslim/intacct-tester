/***********************************************
 * Unofficial Node JS Test Client for Intacct XML API
 * author: brian ruslim (author is not affiliated with intacct)
 * date: 2012-02-29 
 * usage: node tester.js < in.xml > out.txt
 * licence: cc0 - public domain - no warranty
 ***********************************************/

var https = require('https');
var JSON = require('JSON');

var len = 0;
var data = "";
process.stdin.setEncoding('utf8');
process.stdin.on('data', function(chunk) {
	// write chunk to request object
	len += Buffer.byteLength(chunk,'utf8');
	data = data + chunk.toString('utf8');
});

process.stdin.on('end', function() {	
	// init request object
	/* NOTE: 
	 * XML API Does not accept chunked transfers	 
	 */
	var req = https.request({
		host: 'www.intacct.com',
		path: '/ia/xml/xmlgw.phtml',
		method: 'POST',	
		/* NOTE:
		 * XML API does not follow http standards, 
		 * headers fields are case-sensitive
		 * 
		 * RFC 2616 section 4.2 Message Headers states: (ln 1716) 
		 * Each header field consists of a name 
		 * followed by a colon (":") and the field 
		 * value. Field names are case-insensitive.
		 * http://www.ietf.org/rfc/rfc2616.txt
		 */
		headers: {
			'Content-Type' : 'x-intacct-xml-request', 
			'Content-Length' : len
		}
	});	
	
	// wire up events
	req.on('response', function(res){	
		console.log('STATUS: ' + res.statusCode);
		console.log('HTTP: ' + res.httpVersion);
		console.log('HEADER: ' + JSON.stringify(res.headers));
		res.setEncoding('utf8');
		console.log('BODY (multipart):\n');
		res.on('data', function (chunk) {
			console.log(chunk);
		});
	}).on('error', function(e) {
		console.error(e);		
	});
	
	// send data
	req.end(data,'utf8');		
	
	// output header and data read
	console.log(req._header);	
	console.log(data);	
	
	// visual break for response
	console.log('\n----------\n');
});

// read stdin
process.stdin.resume();
