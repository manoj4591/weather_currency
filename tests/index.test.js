const fullName = (firstName, lastName) => `${firstName} ${lastName}`;

describe('Testing the tests setup', () => {
    it('Should return the full name', () => {
        const result = `Manoj suryawanshi`;
        expect(fullName("Manoj", "suryawanshi")).toBe(result);
    });
});
