# Facture

Facture is a programming language for authoring process specifications and work instructions for manufacturing.

# Object Interface

The fundamental building block of the Facture programming language are `object interfaces`.

An interface describes a data contract:

```ts
global interface WorkInstruction {
  product: Product;
  mechaicalEngineer: string;
  qualityEngineer: string;
  steps: Step[] | Step{}
}
```

We then create an object named `PRT001` that references the `WorkInstruction` interface. This ensures that every object referencing the `WorkInstruction` interface is required to contain the same data.

```ts
  define WorkInstruction PRT001 {
    product: PRT001
    mechanicalEngineer: 'Steve'
    qualityEngineer: 'Bill'
    steps: [
      _0010
      _0020
      _0030
    ]
  }
```

# Specifications

## Interface

1. An interface is defined with the keyword `interface` followed by the name in camel-case. Each interface specifies a `[key]: [type]` pair.

```ts
interface WorkInstruction {
  product: Product;
  engineer: string;
  steps: Step{} | Step[]
}
```

2. Each attribute must be assigned a type. It can either be a primitive type or another interface that has been specified elsewhere in the code.

Built-in types are:

> - string
> - number
> - Markdown

```ts
interface Product {
  name: string;
  number: string;
}
```

3. Union types can be declared: `'manufacturing' | 'quality'`

- The VsCode extension provides auto-completion for union types.

```ts
interface Step {
  type: 'manufacturing' | 'quality'
  qualification: Qualification
  markdown: Markdown{}
}
```

4. Creating an object always begins with the keyword `define` followed by the interface then a camel-case name of the object

5. The object will be required to have all properties. VsCode provides completion for all types and referenced objects.

```ts
define Product PRT001 {
  name: 'Bracket'
  number: 'PRT001'
}

define WorkInstruction PRT001 {
  product: PRT001
  engineer: 'Steve'
  steps: [
    _0010
    _0020
  ]
}
```

6. Type modifiers (`[]` and `{}`) are used to tell facture how the
