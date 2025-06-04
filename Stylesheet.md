# Stylesheet

### How to Clone and Other Git Commands

Github allows us to clone projects and even specific branches. We can run the following command to receive the `main` branch:

```sh
git clone <repo url>
```

To see all branches available you can run:

```sh
git branch
```

To switch between available branches you can run:

```
git checkout <branch name>
```

To create a new branch you can run:

```
git checkout -b <initials/feature or issue>
```

To stash a working batch:

```
git stash
```


## Code

### React-Router V6
This project is utiizling React-Router v6. This is a relatively new change to the React-Router syntax, and thus may be confusing at first. These changes can be found in the `frontend/src/App.tsx` file.

To add a new route, you must add a new path object to the `mainRoutes` array. Example:

```ts
  const mainRoutes = [
  {
    path: '/',
    element: <Splash />,
  },
  {
    path: '*',
    element: <h1>404: Error Page</h1>
  },
]
```

The path key let's us declare what url in the browser will trigger a specific rendered item

The element key lets us determine what react we want to be rendered at that path. In the example above, we can pass in custom `Screens` from the `frontend/src/screens` directory. These are basically just compartmentalized react components that are built using react sub-components. You can also see regular react would work just as well by passing in `HTML`tags, but this should be avoided.


### Custom Typings

Custom Typings can be added to the `/frontend/src/typings/` directory. New files can be created using `filename.d.ts` structure.

For creating a custom Redux type, we can go into the `redux.d.ts` file.

Each type should follow similar syntax:

```ts
export interface TypeName {

}
```

Here we can declare the structure of our data from the backend and how we want our redux slice to look. Take Spot, for example, it can look like this:


```ts
export interface Spot {
    id: number,
    ownerId: number,
    address: string,
    city: string,
    state: string,
    country: string,
    description: string,
    avgRating: number,
    price: number,
    lat: number,
    lng: number,
    previewImage: string,
    createdAt: string
    updatedAt: string
}
```
If I want to use that type within another type, I can do:

```ts
export interface Spots{
    spots: Spot[]
}
```
This is saying we have a Spots object where a key of "spots" is present, and the value of that key is an array of Spot objects that follow the structure of the Spot Interface above. Cool!

## Redux

Redux has some great docs for this.
### State Normalization
[Normalize State Shape](https://redux.js.org/usage/structuring-reducers/normalizing-state-shape)


Redux states that we should normalize our state as an object. We should take into consideration efficiency and utility when working with state.

We want to normalize the data into using objects for ids (O(1) look up time) and then we can use something like `Object.values` wrapped around our components `useAppSelector()` to convert the values into arrays. If we keep it as an array in our slice of state, it may make it easier to map over the component but this can introduce an O(n)^2 look up time when trying to find an element. For example Spots's state data can now look like this:

```ts
{
    spots: {
        1: Spot{....},
        2: Spot{....},
        3: Spot{....},
        4: Spot{....},
        5: Spot{....},
    }
}

```
We can also keep track of any relevant information we may need to access within our slice of state. Example if I needed to keep track of states:

```ts
{
    spots: {
        byId: {
            1: Spot{....},
            2: Spot{....},
            3: Spot{....},
            4: Spot{....},
            5: Spot{....},
        },
        allStates: States[]
    }
}
```
According to the Redux docs, we should aim to also process all the data manipulation within the reducer itself. We could use a helper function insde the Redux file, but we should definitely avoid having this be rendered via the client. This can drastically help with optimization speeds, especially across different machine constraints.
