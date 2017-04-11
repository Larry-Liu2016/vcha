var expect = require('expect');

var {generateMessage} = require('./message');

describe('generateMessage', () =>{
    it('should generate message object', () => {
        var from = 'Wen';
        var text = 'Message';
        var message = generateMessage(from, text);

        expect(message.createdAt).toBeA('number');
        expect(message).toInclude({from, text});
    })

})