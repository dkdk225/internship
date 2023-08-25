const { AES } = require("../encryption");
const { randomBytes } = require("node:crypto");
//TODO: create this type of test for other types of javascript data
// string
// object
// number

test("should encrypt and decrypt string coherently", () => {
  const str = "test string";
  const key = randomBytes(32);
  const aes = new AES(key);
  const encrypted = aes.encrypt(str);
  const decrypted = aes.decrypt(encrypted).toString("utf-8");
  expect(decrypted).toBe(str);
});

test("should encrypt and decrypt number coherently", () => {
  const num = 489;
  const key = randomBytes(32);
  const aes = new AES(key);
  const encrypted = aes.encrypt(num.toString());
  const decrypted = aes.decrypt(encrypted).toString("utf-8");
  expect(Number(decrypted)).toBe(num);
});

test("should encrypt and decrypt object coherently", () => {
  const obj = { 
    test: "value",
    other: "another value",
    num: 35634,
    otherObj: {
      str: "value",
      num: 4930,
      arr: [4,7,8],
      obj: {}
    },
    arr: [{num: 54865, str: "string"}, 4764, "string inside an array"]
  };
  const key = randomBytes(32);
  const aes = new AES(key);
  const encrypted = aes.encrypt(JSON.stringify(obj));
  const decrypted = aes.decrypt(encrypted);

  expect(JSON.parse(decrypted.toString('utf-8'))).toEqual(obj);
});

test("should encrypt and decrypt array coherently", () => {
  const arr = [
    "testing string",
    54575678,
    {
      obj:{
        str: "str",
        num: 464575675
      }
    },
    [4364, "testing string "]
  ];
  const key = randomBytes(32);
  const aes = new AES(key);
  const encrypted = aes.encrypt(JSON.stringify(arr));
  const decrypted = aes.decrypt(encrypted).toString("utf-8");
  expect(JSON.parse(decrypted)).toEqual(arr);
});

test('should encrypt and decrypt same using the secret key in string and buffer format', ()=>{
  const str = "simple string to be encrypted"
  const key = "2ZY0q0KmzxQYTBbP03L7Z15aQcJ1jQXP"
  const bufKey = Buffer.from(key)
  const aesString = new AES(key) //initialized with string key
  const aesBuffer = new AES(bufKey) // initialized with buffer key
  const encryptedBuf = aesBuffer.encrypt(str)
  const encryptedStr = aesString.encrypt(str)
  expect(aesString.decrypt(encryptedBuf).toString()).toBe(aesBuffer.decrypt(encryptedStr).toString())
})

