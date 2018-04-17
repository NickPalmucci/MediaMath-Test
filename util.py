def loadDb (db, model, data):
    for item in data:
        if type(item['portionSize']) == str:
            item['portionSize'] = 1

        food = model(Food= item['Food'],
                     portionSize= item['portionSize'],
                     pricePortionRatio= item['pricePortionRatio'],
                     caloriesPortionRatio = item['caloriesPortionRatio'])
        db.session.add(food)
    db.session.commit()


def callDb (db, model):
    batch = model.query.all()
    list = []

    for item in batch:
        dict = {'Food': item.Food,
                'portionSize': item.portionSize,
                'pricePortionRatio': item.pricePortionRatio,
                'caloriesPortionRatio': item.caloriesPortionRatio
                }
        list.append(dict)

    return list


