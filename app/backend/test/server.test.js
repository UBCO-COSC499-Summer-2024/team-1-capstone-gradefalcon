const { expect } = require('chai');
const { describe, it } = require('mocha');
const sinon = require('sinon');
const { Pool } = require('pg');

const pool = new Pool();

describe('insertPromises', () => {
  it('should insert students into the database', async () => {
    const students = [
      { studentID: '1', studentName: 'John Doe' },
      { studentID: '2', studentName: 'Jane Smith' },
    ];

    const queryStub = sinon.stub(pool, 'query').resolves();

    const insertPromises = students.map(async (student) => {
      const { studentID, studentName } = student;

      // Insert into enrollment table
      await pool.query(
        'INSERT INTO enrollment (class_id, student_id) VALUES ($1, $2)',
        ['classId', studentID]
      );
    });

    await Promise.all(insertPromises);

    expect(queryStub.callCount).to.equal(2);
    expect(queryStub.getCall(0).args[0]).to.equal(
      'INSERT INTO enrollment (class_id, student_id) VALUES ($1, $2)'
    );
    expect(queryStub.getCall(0).args[1]).to.deep.equal(['classId', '1']);
    expect(queryStub.getCall(1).args[0]).to.equal(
      'INSERT INTO enrollment (class_id, student_id) VALUES ($1, $2)'
    );
    expect(queryStub.getCall(1).args[1]).to.deep.equal(['classId', '2']);

    queryStub.restore();
  });

  it('should throw an error if student data is invalid', async () => {
    const students = [
      { studentID: '1', studentName: 'John Doe' },
      { studentID: '', studentName: 'Jane Smith' },
    ];

    const queryStub = sinon.stub(pool, 'query').resolves();

    const insertPromises = students.map(async (student) => {
      const { studentID, studentName } = student;

      if (!studentID || !studentName) {
        throw new Error('Invalid student data: studentID and studentName are required');
      }

      // Insert into enrollment table
      await pool.query(
        'INSERT INTO enrollment (class_id, student_id) VALUES ($1, $2)',
        ['classId', studentID]
      );
    });

    try {
      await Promise.all(insertPromises);
    } catch (error) {
      expect(error.message).to.equal('Invalid student data: studentID and studentName are required');
    }

    expect(queryStub.callCount).to.equal(1);

    queryStub.restore();
  });
});