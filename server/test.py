
class Host():
  def __init__(self):
    self.array = []

  def print(self):
    print(self.array)


class Modder():
  def __init__(self, array):
    self.array = array

  def add_item(self):
    self.array.append('item')

host = Host()
modder = Modder(host.array)

modder.add_item()
host.print()
