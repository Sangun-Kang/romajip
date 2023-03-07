interface TypeTest {
    name: string
}

export const log = (value: TypeTest) => {
    console.log(value.name)
}