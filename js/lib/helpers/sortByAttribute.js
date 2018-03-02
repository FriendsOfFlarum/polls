export default function (items, attr = 'sort') {
    return items.sort(
        (a, b) => a[attr]() - b[attr]()
    );
}
